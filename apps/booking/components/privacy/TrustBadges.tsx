// Trust Badges and Privacy Controls Component
// POPIA compliance trust signals for competitive differentiation

import {
    Shield,
    Lock,
    Eye,
    Download,
    Trash2,
    CheckCircle,
    AlertCircle,
    Settings,
    FileText,
    Globe
} from 'lucide-react';
import React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TrustBadgesProps {
    tenantId: string;
    isPOPIACompliant?: boolean;
    customerPhone?: string;
    showPrivacyControls?: boolean;
}

export const TrustBadges: React.FC<TrustBadgesProps> = ({
    tenantId,
    isPOPIACompliant = true,
    customerPhone,
    showPrivacyControls = false
}) => {
    return (
        <div className="space-y-6">
            {/* Main Trust Badges */}
            <Card className="border-green-200 bg-green-50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-800">
                        <Shield className="w-5 h-5" />
                        South African Privacy Compliance
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                        {/* POPIA Compliance Badge */}
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                                <CheckCircle className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="font-semibold text-green-800">POPIA Certified</h3>
                            <p className="text-sm text-green-600">Compliant with South African Privacy Act</p>
                            <Badge variant="secondary" className="mt-1 bg-green-100 text-green-800">
                                2025 Certified
                            </Badge>
                        </div>

                        {/* Data Protection Badge */}
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                                <Lock className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="font-semibold text-blue-800">Enterprise Security</h3>
                            <p className="text-sm text-blue-600">AES-256-GCM Encryption</p>
                            <Badge variant="secondary" className="mt-1 bg-blue-100 text-blue-800">
                                Bank-Grade Security
                            </Badge>
                        </div>

                        {/* Privacy by Design Badge */}
                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                                <Eye className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="font-semibold text-purple-800">Privacy by Design</h3>
                            <p className="text-sm text-purple-600">Your data, your control</p>
                            <Badge variant="secondary" className="mt-1 bg-purple-100 text-purple-800">
                                Granular Controls
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Compliance Indicators */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Compliance Status
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Data Protection Officer</span>
                            <Badge className="bg-green-100 text-green-800">Assigned</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Consent Management</span>
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Audit Trail</span>
                            <Badge className="bg-green-100 text-green-800">Complete</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Data Breach Response</span>
                            <Badge className="bg-green-100 text-green-800">Ready</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Regular Audits</span>
                            <Badge className="bg-green-100 text-green-800">Quarterly</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Privacy Controls */}
            {showPrivacyControls && customerPhone && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="w-5 h-5" />
                            Your Privacy Controls
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Data Export */}
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Download className="w-5 h-5 text-blue-600" />
                                    <div>
                                        <h4 className="font-medium">Download My Data</h4>
                                        <p className="text-sm text-gray-600">Get a copy of all your personal information</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm">
                                    Export Data
                                </Button>
                            </div>

                            {/* Data Correction */}
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-green-600" />
                                    <div>
                                        <h4 className="font-medium">Correct My Information</h4>
                                        <p className="text-sm text-gray-600">Update or correct your personal details</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm">
                                    Update Info
                                </Button>
                            </div>

                            {/* Account Deletion */}
                            <div className="flex items-center justify-between p-3 border rounded-lg bg-red-50">
                                <div className="flex items-center gap-3">
                                    <Trash2 className="w-5 h-5 text-red-600" />
                                    <div>
                                        <h4 className="font-medium text-red-800">Delete My Account</h4>
                                        <p className="text-sm text-red-600">Permanently delete your account and all data</p>
                                    </div>
                                </div>
                                <Button variant="destructive" size="sm">
                                    Delete Account
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Consent Management */}
            {showPrivacyControls && customerPhone && (
                <Card>
                    <CardHeader>
                        <CardTitle>Consent Management</CardTitle>
                        <p className="text-sm text-gray-600">
                            Control how we use your data for different purposes
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Marketing Consent */}
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div>
                                    <h4 className="font-medium">Marketing Communications</h4>
                                    <p className="text-sm text-gray-600">Receive promotional messages and special offers</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-green-100 text-green-800">Granted</Badge>
                                    <Button variant="ghost" size="sm">
                                        <Settings className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Analytics Consent */}
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div>
                                    <h4 className="font-medium">Analytics & Improvement</h4>
                                    <p className="text-sm text-gray-600">Help us improve our services with usage data</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-green-100 text-green-800">Granted</Badge>
                                    <Button variant="ghost" size="sm">
                                        <Settings className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Third-party Consent */}
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div>
                                    <h4 className="font-medium">Third-party Integrations</h4>
                                    <p className="text-sm text-gray-600">Allow data sharing with trusted partners</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                                    <Button variant="ghost" size="sm">
                                        <Settings className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Contact Information */}
            <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                    <div className="text-center space-y-2">
                        <Globe className="w-8 h-8 text-blue-600 mx-auto" />
                        <h3 className="font-semibold text-blue-800">Questions about your privacy?</h3>
                        <p className="text-sm text-blue-600">
                            Contact our Data Protection Officer
                        </p>
                        <div className="space-y-1 text-sm text-blue-700">
                            <p>📧 privacy@appointmentbooking.co.za</p>
                            <p>📞 +27 (0) 11 234 5678</p>
                            <p>🏢 Information Regulator (SA): inforeg@justice.gov.za</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default TrustBadges;