"""
CSV AI Analyzer - Production Implementation
AI-powered CSV file analysis and business intelligence service
"""

import asyncio
import json
import logging
import os
import tempfile
import uuid
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Union, Any, Tuple
import chardet
import numpy as np
import pandas as pd
from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from openai import AsyncOpenAI
from prometheus_client import Counter, Histogram, Gauge, generate_latest, CONTENT_TYPE_LATEST
import structlog
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.logging import LoggingIntegration
import uvicorn
from contextlib import asynccontextmanager

# Initialize Sentry for error tracking
sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN", ""),
    integrations=[
        FastApiIntegration(auto_enabling=True),
        LoggingIntegration(
            level=logging.INFO,
            event_level=logging.ERROR,
        ),
    ],
    traces_sample_rate=0.1,
    environment=os.getenv("ENVIRONMENT", "production"),
    release="csv-ai-analyzer@1.0.0"
)

# Prometheus metrics
CSV_FILES_PROCESSED = Counter('csv_files_processed_total', 'Total CSV files processed', ['analysis_depth'])
CSV_PROCESSING_TIME = Histogram('csv_processing_seconds', 'Time spent processing CSV files', ['analysis_depth'])
CSV_ANALYSIS_REQUESTS = Counter('csv_analysis_requests_total', 'Total CSV analysis requests', ['status'])
CSV_DATA_QUALITY = Gauge('csv_data_quality_score', 'Data quality score', ['file_type'])

# Setup structured logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()

class CSVAnalysisRequest(BaseModel):
    file_path: Optional[str] = None
    file_content: Optional[bytes] = None
    analysis_depth: str = Field(default="standard", description="Analysis depth: 'basic', 'standard', 'deep', 'comprehensive'")
    focus_areas: Optional[List[str]] = None
    output_format: str = Field(default="json", description="Output format: 'json', 'markdown', 'csv'")
    encoding: Optional[str] = None
    delimiter: Optional[str] = None
    max_rows: int = Field(default=100000, description="Maximum rows to process for large files")

class CSVAnalysisResult(BaseModel):
    file_name: str
    analysis_id: str
    analysis_depth: str
    data_quality_score: float
    column_analysis: List[Dict]
    correlations: List[Dict]
    patterns: List[str]
    anomalies: List[Dict]
    business_insights: List[str]
    recommendations: List[str]
    data_summary: Dict
    processing_time: float
    timestamp: datetime
    encoding_used: str
    row_count: int
    column_count: int

class CSVAIAgent:
    """
    Production CSV AI Analyzer with comprehensive analysis capabilities
    """
    
    def __init__(self, openai_api_key: str):
        self.client = AsyncOpenAI(api_key=openai_api_key)
        self.logger = logger.bind(component="csv_analyzer")
        
    async def analyze_csv_file(self, request: CSVAnalysisRequest) -> CSVAnalysisResult:
        """Comprehensive CSV analysis with AI-powered insights"""
        analysis_id = str(uuid.uuid4())
        start_time = datetime.now()
        
        try:
            self.logger.info(
                "Starting CSV analysis",
                analysis_id=analysis_id,
                analysis_depth=request.analysis_depth
            )
            
            # Load and validate CSV file
            df, encoding_used = await self._load_csv_file(request)
            
            # Apply row limit if specified
            if len(df) > request.max_rows:
                self.logger.info("Applying row limit", original_rows=len(df), limited_rows=request.max_rows)
                df = df.head(request.max_rows)
            
            # Perform comprehensive analysis
            data_quality_score = await self._assess_data_quality(df)
            column_analysis = await self._analyze_columns(df)
            correlations = await self._analyze_correlations(df)
            patterns = await self._detect_patterns(df, request.analysis_depth)
            anomalies = await self._detect_anomalies(df)
            business_insights = await self._generate_business_insights(df, patterns, request.focus_areas)
            recommendations = await self._generate_recommendations(df, patterns, anomalies, business_insights)
            data_summary = await self._generate_data_summary(df)
            
            processing_time = (datetime.now() - start_time).total_seconds()
            
            # Update metrics
            CSV_FILES_PROCESSED.labels(analysis_depth=request.analysis_depth).inc()
            CSV_PROCESSING_TIME.labels(analysis_depth=request.analysis_depth).observe(processing_time)
            CSV_ANALYSIS_REQUESTS.labels(status="success").inc()
            CSV_DATA_QUALITY.labels(file_type="csv").set(data_quality_score)
            
            result = CSVAnalysisResult(
                file_name="uploaded_file.csv",  # Will be updated with actual filename
                analysis_id=analysis_id,
                analysis_depth=request.analysis_depth,
                data_quality_score=data_quality_score,
                column_analysis=column_analysis,
                correlations=correlations,
                patterns=patterns,
                anomalies=anomalies,
                business_insights=business_insights,
                recommendations=recommendations,
                data_summary=data_summary,
                processing_time=processing_time,
                timestamp=datetime.now(),
                encoding_used=encoding_used,
                row_count=len(df),
                column_count=len(df.columns)
            )
            
            self.logger.info(
                "CSV analysis completed",
                analysis_id=analysis_id,
                processing_time=processing_time,
                quality_score=data_quality_score,
                insights_count=len(business_insights)
            )
            
            return result
            
        except Exception as e:
            CSV_ANALYSIS_REQUESTS.labels(status="error").inc()
            self.logger.error(
                "CSV analysis failed",
                analysis_id=analysis_id,
                error=str(e),
                exc_info=True
            )
            raise
    
    async def _load_csv_file(self, request: CSVAnalysisRequest) -> Tuple[pd.DataFrame, str]:
        """Load CSV file with automatic encoding detection"""
        try:
            if request.file_path:
                # Load from file path
                encoding_used = self._detect_encoding(request.file_path)
                df = pd.read_csv(request.file_path, encoding=encoding_used, delimiter=request.delimiter)
            elif request.file_content:
                # Load from bytes content
                encoding_used = request.encoding or self._detect_encoding_from_bytes(request.file_content)
                
                with tempfile.NamedTemporaryFile(suffix='.csv', delete=False) as tmp_file:
                    tmp_file.write(request.file_content)
                    tmp_file.flush()
                    
                    try:
                        df = pd.read_csv(
                            tmp_file.name, 
                            encoding=encoding_used, 
                            delimiter=request.delimiter,
                            low_memory=False  # Avoid dtype warnings
                        )
                    except pd.errors.ParserError as e:
                        # Try alternative delimiters
                        for delimiter in [',', ';', '\t', '|']:
                            try:
                                df = pd.read_csv(
                                    tmp_file.name,
                                    encoding=encoding_used,
                                    delimiter=delimiter,
                                    low_memory=False
                                )
                                break
                            except:
                                continue
                        else:
                            raise HTTPException(
                                status_code=400, 
                                detail=f"Unable to parse CSV file. Please check the delimiter and format."
                            )
                    
                    os.unlink(tmp_file.name)
            else:
                raise ValueError("No file content or path provided")
            
            # Data validation
            if df.empty:
                raise ValueError("CSV file is empty")
            
            self.logger.info(
                "CSV file loaded successfully",
                encoding=encoding_used,
                rows=len(df),
                columns=len(df.columns)
            )
            
            return df, encoding_used
            
        except Exception as e:
            self.logger.error("Failed to load CSV file", error=str(e))
            raise HTTPException(status_code=400, detail=f"Failed to load CSV file: {str(e)}")
    
    def _detect_encoding(self, file_path: str) -> str:
        """Detect file encoding"""
        try:
            with open(file_path, 'rb') as f:
                raw_data = f.read(10000)  # Read first 10KB
                result = chardet.detect(raw_data)
                return result['encoding'] or 'utf-8'
        except:
            return 'utf-8'
    
    def _detect_encoding_from_bytes(self, content: bytes) -> str:
        """Detect encoding from bytes content"""
        try:
            result = chardet.detect(content[:10000])
            return result['encoding'] or 'utf-8'
        except:
            return 'utf-8'
    
    async def _assess_data_quality(self, df: pd.DataFrame) -> float:
        """Calculate comprehensive data quality score (0-100)"""
        try:
            total_cells = len(df) * len(df.columns)
            
            # Completeness score (35% weight)
            completeness = 1 - (df.isnull().sum().sum() / total_cells)
            
            # Accuracy score (25% weight) - based on data type consistency
            accuracy_scores = []
            for col in df.columns:
                if pd.api.types.is_numeric_dtype(df[col]):
                    # Check for reasonable numeric values
                    if df[col].notna().any():
                        # Check for reasonable ranges
                        if df[col].min() >= 0 and df[col].max() <= 1e15:  # Reasonable numeric range
                            accuracy_scores.append(0.9)
                        else:
                            accuracy_scores.append(0.7)
                elif pd.api.types.is_datetime64_any_dtype(df[col]):
                    # Check date consistency
                    date_range = (df[col].max() - df[col].min()).days
                    if 0 < date_range < 36500:  # Within 100 years
                        accuracy_scores.append(0.9)
                    else:
                        accuracy_scores.append(0.6)
                else:
                    # String consistency check
                    avg_length = df[col].astype(str).str.len().mean()
                    if avg_length > 0:
                        length_consistency = 1 - (df[col].astype(str).str.len().std() / avg_length)
                        accuracy_scores.append(max(0, length_consistency))
            
            accuracy = sum(accuracy_scores) / len(accuracy_scores) if accuracy_scores else 1.0
            
            # Consistency score (25% weight)
            consistency = 1 - (df.duplicated().sum() / len(df))
            
            # Uniqueness score (15% weight)
            avg_uniqueness = df.nunique().mean() / len(df)
            uniqueness = min(1.0, avg_uniqueness * 2)  # Scale up
            
            # Overall quality score
            quality_score = (
                completeness * 0.35 +
                accuracy * 0.25 +
                consistency * 0.25 +
                uniqueness * 0.15
            ) * 100
            
            return min(100, max(0, quality_score))
            
        except Exception as e:
            self.logger.error("Data quality assessment failed", error=str(e))
            return 50.0  # Default moderate score
    
    async def _analyze_columns(self, df: pd.DataFrame) -> List[Dict]:
        """Detailed column analysis"""
        column_analysis = []
        
        for col in df.columns:
            analysis = {
                "name": col,
                "type": str(df[col].dtype),
                "completeness": float(df[col].count() / len(df)),
                "uniqueness": float(df[col].nunique() / len(df)),
                "data_quality": {}
            }
            
            # Type-specific analysis
            if pd.api.types.is_numeric_dtype(df[col]):
                analysis["data_quality"] = {
                    "mean": float(df[col].mean()) if pd.notna(df[col].mean()) else None,
                    "median": float(df[col].median()) if pd.notna(df[col].median()) else None,
                    "std": float(df[col].std()) if pd.notna(df[col].std()) else None,
                    "min": float(df[col].min()) if pd.notna(df[col].min()) else None,
                    "max": float(df[col].max()) if pd.notna(df[col].max()) else None,
                    "skewness": float(df[col].skew()) if pd.notna(df[col].skew()) else None,
                    "outliers": await self._detect_outliers(df[col])
                }
            elif pd.api.types.is_datetime64_any_dtype(df[col]):
                # Date analysis
                date_series = pd.to_datetime(df[col], errors='coerce')
                analysis["data_quality"] = {
                    "date_range": {
                        "start": str(date_series.min()) if pd.notna(date_series.min()) else None,
                        "end": str(date_series.max()) if pd.notna(date_series.max()) else None
                    },
                    "time_span_days": int((date_series.max() - date_series.min()).days) if pd.notna(date_series.min()) and pd.notna(date_series.max()) else None,
                    "missing_dates": int(date_series.isnull().sum())
                }
            else:
                # Categorical analysis
                value_counts = df[col].value_counts().head(10)
                unique_ratio = df[col].nunique() / len(df)
                
                analysis["data_quality"] = {
                    "top_values": value_counts.to_dict(),
                    "rare_values": len(df[col].value_counts()) - len(value_counts),
                    "unique_ratio": float(unique_ratio),
                    "categorical_type": "low_cardinality" if unique_ratio < 0.1 else "medium_cardinality" if unique_ratio < 0.5 else "high_cardinality",
                    "entropy": self._calculate_entropy(df[col])
                }
            
            column_analysis.append(analysis)
        
        return column_analysis
    
    def _calculate_entropy(self, series: pd.Series) -> float:
        """Calculate entropy for categorical data"""
        try:
            value_counts = series.value_counts()
            probabilities = value_counts / len(series)
            entropy = -sum(p * np.log2(p) for p in probabilities if p > 0)
            return round(entropy, 3)
        except:
            return 0.0
    
    async def _detect_outliers(self, series: pd.Series) -> Dict:
        """Detect outliers in a numeric series using multiple methods"""
        if len(series.dropna()) < 4:
            return {"count": 0, "percentage": 0, "method": "insufficient_data"}
        
        outliers_info = {}
        
        try:
            # Z-score method
            z_scores = np.abs((series - series.mean()) / series.std())
            z_outliers = series[z_scores > 3]
            outliers_info["z_score"] = {
                "count": len(z_outliers),
                "percentage": len(z_outliers) / len(series) * 100
            }
            
            # IQR method
            Q1 = series.quantile(0.25)
            Q3 = series.quantile(0.75)
            IQR = Q3 - Q1
            iqr_outliers = series[(series < Q1 - 1.5 * IQR) | (series > Q3 + 1.5 * IQR)]
            outliers_info["iqr"] = {
                "count": len(iqr_outliers),
                "percentage": len(iqr_outliers) / len(series) * 100,
                "bounds": {"lower": Q1 - 1.5 * IQR, "upper": Q3 + 1.5 * IQR}
            }
            
            # Isolation Forest (if available)
            try:
                from sklearn.ensemble import IsolationForest
                iso_forest = IsolationForest(contamination=0.1, random_state=42)
                outlier_labels = iso_forest.fit_predict(series.values.reshape(-1, 1))
                iso_outliers = series[outlier_labels == -1]
                outliers_info["isolation_forest"] = {
                    "count": len(iso_outliers),
                    "percentage": len(iso_outliers) / len(series) * 100
                }
            except ImportError:
                pass
                
        except Exception as e:
            self.logger.warning("Outlier detection failed", error=str(e))
            return {"count": 0, "percentage": 0, "method": "error"}
        
        return outliers_info
    
    async def _analyze_correlations(self, df: pd.DataFrame) -> List[Dict]:
        """Analyze correlations between numeric columns"""
        correlations = []
        
        try:
            numeric_cols = df.select_dtypes(include=[np.number]).columns
            
            if len(numeric_cols) > 1:
                # Pearson correlation
                corr_matrix = df[numeric_cols].corr()
                
                for i, col1 in enumerate(numeric_cols):
                    for j, col2 in enumerate(numeric_cols):
                        if i < j:  # Avoid duplicates
                            corr_value = corr_matrix.loc[col1, col2]
                            if abs(corr_value) > 0.3:  # Only significant correlations
                                correlations.append({
                                    "variables": [col1, col2],
                                    "correlation": float(corr_value),
                                    "strength": "strong" if abs(corr_value) > 0.7 else "moderate",
                                    "direction": "positive" if corr_value > 0 else "negative",
                                    "method": "pearson"
                                })
                
                # Spearman correlation for non-linear relationships
                try:
                    spearman_corr = df[numeric_cols].corr(method='spearman')
                    
                    for i, col1 in enumerate(numeric_cols):
                        for j, col2 in enumerate(numeric_cols):
                            if i < j:
                                spearman_value = spearman_corr.loc[col1, col2]
                                if abs(spearman_value) > 0.3 and abs(spearman_value - corr_matrix.loc[col1, col2]) > 0.2:
                                    correlations.append({
                                        "variables": [col1, col2],
                                        "correlation": float(spearman_value),
                                        "strength": "strong" if abs(spearman_value) > 0.7 else "moderate",
                                        "direction": "positive" if spearman_value > 0 else "negative",
                                        "method": "spearman",
                                        "note": "Non-linear relationship detected"
                                    })
                except:
                    pass
                    
        except Exception as e:
            self.logger.error("Correlation analysis failed", error=str(e))
        
        return correlations
    
    async def _detect_patterns(self, df: pd.DataFrame, depth: str) -> List[str]:
        """Detect patterns in the data"""
        patterns = []
        
        try:
            # Basic patterns
            if len(df) > 0:
                # Temporal patterns
                date_cols = df.select_dtypes(include=['datetime64', 'object']).columns
                for col in date_cols:
                    try:
                        # Try to parse as date
                        date_series = pd.to_datetime(df[col], errors='coerce')
                        if date_series.notna().sum() > len(df) * 0.8:  # 80% valid dates
                            patterns.append(f"Temporal pattern detected in {col}")
                            
                            # Weekly patterns
                            weekday_counts = date_series.dt.day_name().value_counts()
                            if weekday_counts.std() / weekday_counts.mean() > 0.2:
                                patterns.append(f"Weekly variation in {col}")
                            
                            # Monthly patterns
                            monthly_counts = date_series.dt.month.value_counts()
                            if monthly_counts.std() / monthly_counts.mean() > 0.3:
                                patterns.append(f"Seasonal variation in {col}")
                    except:
                        continue
                
                # Value distribution patterns
                for col in df.select_dtypes(include=[np.number]).columns:
                    series = df[col].dropna()
                    if len(series) > 0:
                        # Skewness analysis
                        skewness = series.skew()
                        if abs(skewness) > 1:
                            skew_direction = "right" if skewness > 0 else "left"
                            patterns.append(f"{col} shows {skew_direction} skewness (skew={skewness:.3f})")
                        
                        # Check for power law distribution
                        positive_values = series[series > 0]
                        if len(positive_values) > 10:
                            log_values = np.log10(positive_values)
                            if len(log_values) > 0:
                                correlation = np.corrcoef(range(len(log_values)), log_values)[0,1]
                                if abs(correlation) > 0.8:
                                    patterns.append(f"{col} follows power law distribution")
                
                # Deep analysis if requested
                if depth in ["deep", "comprehensive"]:
                    patterns.extend(await self._deep_pattern_analysis(df))
        
        except Exception as e:
            self.logger.error("Pattern detection failed", error=str(e))
        
        return patterns
    
    async def _deep_pattern_analysis(self, df: pd.DataFrame) -> List[str]:
        """Deep pattern analysis using advanced techniques"""
        patterns = []
        
        try:
            # Clustering analysis
            try:
                # Clustering analysis requires scikit-learn
                from sklearn.cluster import KMeans
                from sklearn.preprocessing import StandardScaler
                
                numeric_cols = df.select_dtypes(include=[np.number]).columns
                if len(numeric_cols) >= 2:
                    # Clean data for clustering
                    clean_data = df[numeric_cols].fillna(df[numeric_cols].median())
                    
                    # Try different cluster numbers
                    for n_clusters in [2, 3, 4, 5]:
                        if len(clean_data) >= n_clusters * 10:  # Minimum ratio
                            scaler = StandardScaler()
                            scaled_data = scaler.fit_transform(clean_data)
                            
                            kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
                            clusters = kmeans.fit_predict(scaled_data)
                            
                            # Check cluster balance
                            cluster_counts = pd.Series(clusters).value_counts()
                            min_cluster_size = cluster_counts.min()
                            max_cluster_size = cluster_counts.max()
                            
                            if min_cluster_size / max_cluster_size > 0.1:  # Balanced clusters
                                patterns.append(f"Natural grouping detected ({n_clusters} clusters)")
                                
                                # Analyze cluster characteristics
                                cluster_df = clean_data.copy()
                                cluster_df['cluster'] = clusters
                                
                                for cluster_id in range(n_clusters):
                                    cluster_data = cluster_df[cluster_df['cluster'] == cluster_id]
                                    if len(cluster_data) > 5:
                                        characteristics = []
                                        for col in numeric_cols:
                                            cluster_mean = cluster_data[col].mean()
                                            overall_mean = clean_data[col].mean()
                                            if abs(cluster_mean - overall_mean) > overall_mean * 0.5:
                                                direction = "higher" if cluster_mean > overall_mean else "lower"
                                                characteristics.append(f"{direction} {col}")
                                        
                                        if characteristics:
                                            patterns.append(f"Cluster {cluster_id} characterized by {', '.join(characteristics)}")
                                break
            except ImportError:
                self.logger.warning("Advanced clustering requires scikit-learn")
            
            # Seasonality analysis for time series
            numeric_cols = df.select_dtypes(include=[np.number]).columns
            for col in numeric_cols:
                if len(df) > 50:  # Minimum data points
                    try:
                        # Simple autocorrelation check
                        series = df[col].fillna(method='ffill')
                        if len(series) > 20:
                            autocorr = series.autocorr()
                            if abs(autocorr) > 0.3:
                                patterns.append(f"Autocorrelation detected in {col} (r={autocorr:.3f})")
                    except:
                        continue
            
            # Anomaly pattern analysis
            try:
                from sklearn.ensemble import IsolationForest
                
                numeric_data = df[numeric_cols].fillna(df[numeric_cols].median())
                if len(numeric_cols) >= 2 and len(numeric_data) > 20:
                    iso_forest = IsolationForest(contamination=0.05, random_state=42)
                    anomaly_labels = iso_forest.fit_predict(numeric_data)
                    
                    if sum(anomaly_labels == -1) > 0:
                        patterns.append("Anomalous records detected - potential data quality issues or rare events")
            except ImportError:
                pass
                
        except Exception as e:
            self.logger.error("Deep pattern analysis failed", error=str(e))
        
        return patterns
    
    async def _detect_anomalies(self, df: pd.DataFrame) -> List[Dict]:
        """Detect anomalies using multiple statistical methods"""
        anomalies = []
        
        try:
            # Focus on numeric columns for anomaly detection
            numeric_cols = df.select_dtypes(include=[np.number]).columns
            
            for col in numeric_cols:
                series = df[col].dropna()
                
                if len(series) < 10:
                    continue
                
                try:
                    # Z-score method for anomaly detection
                    z_scores = np.abs((series - series.mean()) / series.std())
                    z_outliers = series[z_scores > 3]
                    
                    if len(z_outliers) > 0:
                        outlier_percentage = (len(z_outliers) / len(series)) * 100
                        anomalies.append({
                            "column": col,
                            "method": "z_score",
                            "count": len(z_outliers),
                            "percentage": round(outlier_percentage, 2),
                            "severity": "high" if outlier_percentage > 5 else "moderate",
                            "description": f"{len(z_outliers)} extreme outliers (Z-score > 3)"
                        })
                    
                    # IQR method for outlier detection
                    Q1 = series.quantile(0.25)
                    Q3 = series.quantile(0.75)
                    IQR = Q3 - Q1
                    
                    iqr_outliers = series[(series < Q1 - 1.5 * IQR) | (series > Q3 + 1.5 * IQR)]
                    
                    if len(iqr_outliers) > 0:
                        outlier_percentage = (len(iqr_outliers) / len(series)) * 100
                        anomalies.append({
                            "column": col,
                            "method": "iqr",
                            "count": len(iqr_outliers),
                            "percentage": round(outlier_percentage, 2),
                            "severity": "moderate",
                            "description": f"{len(iqr_outliers)} moderate outliers (IQR method)"
                        })
                        
                except Exception as e:
                    self.logger.warning("Anomaly detection failed for column", column=col, error=str(e))
                    continue
            
            # Multivariate anomaly detection using Isolation Forest
            try:
                from sklearn.ensemble import IsolationForest
                
                numeric_data = df[numeric_cols].fillna(df[numeric_cols].median())
                
                if len(numeric_cols) >= 2 and len(numeric_data) > 20:
                    iso_forest = IsolationForest(contamination=0.1, random_state=42)
                    anomaly_labels = iso_forest.fit_predict(numeric_data)
                    
                    anomaly_count = sum(anomaly_labels == -1)
                    if anomaly_count > 0:
                        anomaly_percentage = (anomaly_count / len(numeric_data)) * 100
                        anomalies.append({
                            "column": "multivariate",
                            "method": "isolation_forest",
                            "count": anomaly_count,
                            "percentage": round(anomaly_percentage, 2),
                            "severity": "high" if anomaly_percentage > 10 else "moderate",
                            "description": f"{anomaly_count} records show unusual multivariate patterns"
                        })
                        
            except ImportError:
                self.logger.warning("Multivariate anomaly detection requires scikit-learn")
                
        except Exception as e:
            self.logger.error("Anomaly detection failed", error=str(e))
        
        return anomalies
    
    async def _generate_business_insights(self, df: pd.DataFrame, patterns: List[str], focus_areas: Optional[List[str]]) -> List[str]:
        """Generate business insights using AI"""
        try:
            context = self._prepare_analysis_context(df, patterns, focus_areas)
            
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {
                        "role": "system", 
                        "content": "You are a senior business analyst with expertise in data-driven decision making. Generate actionable business insights from CSV data analysis. Focus on strategic implications and competitive advantages."
                    },
                    {
                        "role": "user", 
                        "content": f"Analyze this CSV data and provide business insights:\n\n{context}"
                    }
                ],
                max_tokens=1000,
                temperature=0.2
            )
            
            insights_text = response.choices[0].message.content
            
            # Parse insights
            insights = []
            for line in insights_text.split('\n'):
                line = line.strip()
                if line and (line.startswith('-') or line.startswith('*') or line.startswith('•') or line[0].isdigit()):
                    insight = line.lstrip('- *•0123456789. ').strip()
                    if len(insight) > 15:  # Filter out very short insights
                        insights.append(insight)
            
            # If no formatted insights found, try to extract sentences
            if not insights:
                insights = [sentence.strip() for sentence in insights_text.split('.') if len(sentence.strip()) > 20]
            
            self.logger.info("Business insights generated", insights_count=len(insights))
            return insights[:8]  # Limit to top 8 insights
            
        except Exception as e:
            self.logger.error("Business insights generation failed", error=str(e))
            return ["Business insights temporarily unavailable. Basic data analysis completed."]
    
    def _prepare_analysis_context(self, df: pd.DataFrame, patterns: List[str], focus_areas: Optional[List[str]]) -> str:
        """Prepare comprehensive context for AI business analysis"""
        context = f"""
CSV DATASET BUSINESS ANALYSIS

Dataset Overview:
- Rows: {len(df)}
- Columns: {len(df.columns)}
- Data completeness: {1 - (df.isnull().sum().sum() / (len(df) * len(df.columns))):.1%}
- File size: {df.memory_usage(deep=True).sum() / 1024 / 1024:.1f} MB

Column Analysis:
"""
        
        # Add column information
        for col in df.columns[:10]:  # Limit to first 10 columns for readability
            dtype = str(df[col].dtype)
            non_null = df[col].count()
            unique = df[col].nunique()
            
            if pd.api.types.is_numeric_dtype(df[col]):
                stats = df[col].describe()
                context += f"- {col}: numeric, {non_null} values, {unique} unique, range: {stats['min']:.2f} to {stats['max']:.2f}\n"
            else:
                top_values = df[col].value_counts().head(3)
                context += f"- {col}: categorical, {non_null} values, {unique} unique, top: {top_values.to_dict()}\n"
        
        if len(df.columns) > 10:
            context += f"... and {len(df.columns) - 10} more columns\n"
        
        # Add detected patterns
        if patterns:
            context += f"\nDetected Patterns:\n{chr(10).join(f'- {p}' for p in patterns[:5])}\n"
        
        # Add focus areas
        if focus_areas:
            context += f"\nFocus Areas: {', '.join(focus_areas)}\n"
        
        context += """
Please provide:
1. Key business opportunities and competitive advantages
2. Strategic recommendations for growth
3. Risk factors and mitigation strategies
4. Operational efficiency insights
5. Market positioning implications

Focus on insights that drive business value and strategic decision-making.
"""
        return context
    
    async def _generate_recommendations(self, df: pd.DataFrame, patterns: List[str], anomalies: List[Dict], business_insights: List[str]) -> List[str]:
        """Generate actionable recommendations"""
        recommendations = []
        
        try:
            # Data quality recommendations
            missing_percentage = (df.isnull().sum().sum() / (len(df) * len(df.columns))) * 100
            duplicate_percentage = (df.duplicated().sum() / len(df)) * 100
            
            if missing_percentage > 10:
                recommendations.append(
                    f"Data Quality Priority: Address {missing_percentage:.1f}% missing values through improved data collection or imputation strategies"
                )
            elif missing_percentage > 5:
                recommendations.append(
                    f"Data Enhancement: Consider filling {missing_percentage:.1f}% missing values to improve analysis accuracy"
                )
            
            if duplicate_percentage > 2:
                recommendations.append(
                    f"Data Cleaning: Remove {df.duplicated().sum()} duplicate records ({duplicate_percentage:.1f}%) to ensure data integrity"
                )
            
            # Pattern-based recommendations
            for pattern in patterns:
                if "seasonal" in pattern.lower() or "weekly" in pattern.lower():
                    recommendations.append(
                        "Seasonal Strategy: Implement seasonal resource planning and marketing campaigns based on detected patterns"
                    )
                elif "correlation" in pattern.lower():
                    recommendations.append(
                        "Relationship Analysis: Investigate causal relationships between correlated variables for strategic insights"
                    )
                elif "cluster" in pattern.lower():
                    recommendations.append(
                        "Segmentation Strategy: Develop targeted approaches for different customer/segment clusters identified"
                    )
                elif "power law" in pattern.lower():
                    recommendations.append(
                        "Focus Strategy: Apply 80/20 rule analysis - identify the vital few factors driving the majority of outcomes"
                    )
            
            # Anomaly-based recommendations
            high_severity_anomalies = [a for a in anomalies if a.get('severity') == 'high']
            if high_severity_anomalies:
                recommendations.append(
                    f"Risk Assessment: Investigate {len(high_severity_anomalies)} high-severity anomalies for data quality issues or rare events"
                )
            
            moderate_anomalies = [a for a in anomalies if a.get('severity') == 'moderate']
            if moderate_anomalies:
                recommendations.append(
                    f"Quality Review: Monitor {len(moderate_anomalies)} moderate anomalies for potential data drift or emerging patterns"
                )
            
            # Business insight-based recommendations
            for insight in business_insights:
                if any(keyword in insight.lower() for keyword in ["opportunity", "potential", "growth", "leverage"]):
                    recommendations.append(f"Strategic Opportunity: {insight}")
                elif any(keyword in insight.lower() for keyword in ["risk", "concern", "challenge", "issue"]):
                    recommendations.append(f"Risk Mitigation: {insight}")
                elif any(keyword in insight.lower() for keyword in ["efficiency", "optimize", "improve"]):
                    recommendations.append(f"Operational Optimization: {insight}")
            
            # Technical recommendations based on data characteristics
            numeric_cols = len(df.select_dtypes(include=[np.number]).columns)
            categorical_cols = len(df.select_dtypes(include=['object']).columns)
            
            if numeric_cols > categorical_cols * 2:
                recommendations.append(
                    "Advanced Analytics: Consider predictive modeling and regression analysis for rich numerical datasets"
                )
            
            if len(df) > 50000:
                recommendations.append(
                    "Big Data Strategy: Implement sampling techniques or distributed processing for efficient analysis of large datasets"
                )
            
            if len(df.columns) > 20:
                recommendations.append(
                    "Feature Engineering: Consider dimensionality reduction techniques to focus on the most impactful variables"
                )
            
        except Exception as e:
            self.logger.error("Recommendation generation failed", error=str(e))
            recommendations.append("Recommendation engine temporarily unavailable")
        
        return recommendations[:10]  # Limit to top 10 recommendations
    
    async def _generate_data_summary(self, df: pd.DataFrame) -> Dict:
        """Generate comprehensive data summary"""
        return {
            "dimensions": {
                "rows": len(df),
                "columns": len(df.columns),
                "cells": len(df) * len(df.columns)
            },
            "data_types": df.dtypes.astype(str).value_counts().to_dict(),
            "memory_usage_mb": round(df.memory_usage(deep=True).sum() / 1024 / 1024, 2),
            "completeness": round(1 - (df.isnull().sum().sum() / (len(df) * len(df.columns))), 3),
            "uniqueness": round(df.nunique().sum() / (len(df) * len(df.columns)), 3),
            "categorical_columns": list(df.select_dtypes(include=['object']).columns),
            "numeric_columns": list(df.select_dtypes(include=[np.number]).columns),
            "datetime_columns": list(df.select_dtypes(include=['datetime64']).columns),
            "quality_distribution": {
                "high_quality_cols": len([col for col in df.columns if df[col].count() / len(df) > 0.9]),
                "medium_quality_cols": len([col for col in df.columns if 0.7 < df[col].count() / len(df) <= 0.9]),
                "low_quality_cols": len([col for col in df.columns if df[col].count() / len(df) <= 0.7])
            }
        }

# Global agent instance
agent: Optional[CSVAIAgent] = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan management"""
    global agent
    # Startup
    logger.info("Starting CSV AI Analyzer service...")
    agent = CSVAIAgent(openai_api_key=os.getenv("OPENAI_API_KEY"))
    logger.info("CSV AI Analyzer service ready")
    
    yield
    
    # Shutdown
    logger.info("Shutting down CSV AI Analyzer service...")

# Create FastAPI application
app = FastAPI(
    title="CSV AI Analyzer",
    description="AI-powered CSV file analysis and business intelligence service",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "csv-ai-analyzer",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/metrics")
async def get_metrics():
    """Prometheus metrics endpoint"""
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)

@app.post("/analyze", response_model=CSVAnalysisResult)
async def analyze_csv(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(..., description="CSV file to analyze"),
    analysis_depth: str = "standard",
    focus_areas: Optional[str] = None,
    encoding: Optional[str] = None,
    delimiter: Optional[str] = None,
    max_rows: int = 100000
):
    """
    Analyze uploaded CSV file with AI-powered insights
    
    - **file**: CSV file to analyze
    - **analysis_depth**: Analysis depth (basic, standard, deep, comprehensive)
    - **focus_areas**: Optional specific areas to focus on (comma-separated)
    - **encoding**: File encoding (auto-detected if not specified)
    - **delimiter**: CSV delimiter (auto-detected if not specified)
    - **max_rows**: Maximum rows to process (default: 100,000)
    """
    if not agent:
        raise HTTPException(status_code=503, detail="Service not ready")
    
    try:
        # Validate file type
        if not file.filename.endswith('.csv'):
            raise HTTPException(status_code=400, detail="Unsupported file format. Please upload CSV files only.")
        
        # Validate file size (max 100MB)
        file_content = await file.read()
        if len(file_content) > 100 * 1024 * 1024:  # 100MB
            raise HTTPException(status_code=400, detail="File too large. Maximum size is 100MB.")
        
        # Parse focus areas
        focus_areas_list = [area.strip() for area in focus_areas.split(',')] if focus_areas else None
        
        # Create analysis request
        request = CSVAnalysisRequest(
            file_content=file_content,
            analysis_depth=analysis_depth,
            focus_areas=focus_areas_list,
            encoding=encoding,
            delimiter=delimiter,
            max_rows=max_rows
        )
        
        # Process file
        result = await agent.analyze_csv_file(request)
        result.file_name = file.filename  # Update with actual filename
        
        logger.info(
            "CSV analysis completed",
            analysis_id=result.analysis_id,
            filename=file.filename,
            processing_time=result.processing_time,
            quality_score=result.data_quality_score
        )
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("CSV analysis failed", error=str(e), exc_info=True)
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.get("/analyze/{analysis_id}")
async def get_analysis_result(analysis_id: str):
    """Get analysis result by ID (placeholder for future caching implementation)"""
    # This would typically fetch from a database
    raise HTTPException(status_code=404, detail="Analysis result not found")

@app.get("/stats")
async def get_service_stats():
    """Get service statistics"""
    return {
        "total_files_processed": int(CSV_FILES_PROCESSED._value._value),
        "average_processing_time": float(CSV_PROCESSING_TIME._sum._value / CSV_PROCESSING_TIME._count._value) if CSV_PROCESSING_TIME._count._value > 0 else 0,
        "success_rate": float(CSV_ANALYSIS_REQUESTS.labels(status="success")._value._value / max(1, sum(CSV_ANALYSIS_REQUESTS._value._value.values()))),
        "average_data_quality": float(CSV_DATA_QUALITY._value._value),
        "service_uptime": "operational",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    uvicorn.run(
        "csv_analyzer:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8001)),
        reload=os.getenv("ENVIRONMENT") == "development",
        log_level=os.getenv("LOG_LEVEL", "info")
    )