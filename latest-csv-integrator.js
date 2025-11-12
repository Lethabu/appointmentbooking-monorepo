const fs = require('fs');

// Parse the latest CSV data
const latestCSV = `Login name,Full name,Mobile,Address,Member #
aobakwe.modise@icloud.com,Olerato ,Modise,"4582 Block B Mabopane 
Pretoria
0190",
booysenlethabo@icloud.com,Lethabo,0691524569,"Soshanguve, block L",
faithselepe333@gmail.com,Kopano Selepe ,081 546 8520 ,827 Marothodi streets block k soshanguve ,
hlomotlalethabo@gmail.com,motlalethabo Gloria ,0660178779,906 dithabaneng street K Soshanguve 0152,
indoniswati@gmail.com,sinethmba Queen maphanga ,+27764492790,890 block BB Soshanguve ,
kamogelooratilwe03@gmail.com,Oratilwe Kamogelo,0614144983,"8022 Nakedi Street 
Mabopane",
karabelolbmotaung02@gmail.com,Karabelo Motaung,+27665972425,6609 Dithabaneng soshanguve block K,
karabosehwana@gmail.com,Karabo,0636598615,1904 Block L Soshanguve ,
katarinacatherine11@gmail.com,catherine,+27608172144,732 block h,
keamogetselebese@gmail.com,Nthabiseng,0615159341,738 block m,
Keneilwemakena5@gmail.com,Keneilwe ,0790206920,607Block F West ,
khethi.naomi@gmail.com,Khethiwe Khethiwe,+27836936515,334 Block L,
koketso.lucky@icloud.com,koketso,0793050383,1709 block gg phaphamang street ,
kutwanemakua@gmail.com,Refilwe Makua ,0721878267,TUT,
lungilenkabi03@gmail.com,lungile Nkabinde ,0727053879,TUT,
lungilethandolwethu9@gmail.com,Thandolwethu,0762951095,6837 Bontle Street ,
mabenabuhle17@gmail.com,Buhle Mabena ,0769317937 ,Duduzani street block Dd soshanguve ,
magagulapalesa20@gmail.com,Palesa,0648431190,1076 Block MM,
mashiagwagwa13@gmail.com,Ditebogo Mashia Gwagwa,0820727761,2047 block h Soshanguve o152,
mdlulitinyiko7@gmail.com,Tinyiko Mdluli,0647026719,,
mkhanyisa@gmail.com,khanyisa madaure,+27793544710,972 Block L,
mndebelenoluthando07@gmail.com,Noluthando Mndebele ,0791187560,"Soshanguve
Block K 189",
mojelaconny5@gmail.com,constance ,0761834308,2670 phase8,
naledijenica551@gmail.com,Naledi Malele,0664202529,,
nkanyane.khensani4@gmail.com,khensani Nkanyane ,0790543631,1240 block bb soshanguve ,
nokuthulazandy21@gmail.com,nokuthula ,0697816866,Block L,
NOMALUNGELOLANGA@GMAIL.COM,Nomalungelo,0797627293,"797 block L 
Soshanguve 
Aubrey mathlala street 
0152 ",
nomthandazomorobe@gmail.com,Nomthadazo ,0769055224,18230 Soshanguve south ,
nsherees@gmail.com,NONJABULO SHEREES THABETHE ,0679029583,Mobopane section D near zungu,
nthabimokhutswane@gmail.com,Nthabiseng ,0796270563,"500 block gg
Soshanguve
0152",
Nyeletiselma26@gmail.com,Nyeleti selma,0722697158,6513 Nguba street sihle residence Soshanguve vv ext 4,
olebogengfmadiba@icloud.com,Olebogeng,+27664223408,543 Block Uu Soshanguve ,
omphemetse.seloane@icloud.com,tsholo,0605206393,"9070 chenille street 
Pretoria townlands",
oratilwemogoba05@gmail.com,Oratilwe ,0716724800,839 block L soshanguve,
phillipine4@gmail.com,Phillipine Masela,0722842199,"696
Maboine",
Phionah.moshibudi@gmail.com,Phionah Montwedi ,0695616919 ,"133 block s soshanguve nyathi street 0152
",
praisegodnjosi@gmail.com,PraiseGod Francina,0646868184,,
preciousdimakatso58@gmail.com,Dimakatso precious,0798077079,1129 block pp soshanguve,
Prudencekgaugelo051@gmail.com,,,,
rasemanankateko@gmail.com,nkateko Rasemana,+27715849487,"Soshanguve block L
Pretoria",
reagobokamichell@gmail.com,Reagoboka Moila,0659004952,,
refbooysen@gmail.com,Vivian ,072 937 0177 ,435 Block L Soshanguve ,
rethakhoza@icloud.com,rethabile,0712615340,,
rmatsoha@gmail.com,Reitumetse ,Matsoha ,,
rorisangroro90@gmail.com,Rorisang Malahlela ,+27813656918,"131 Block Bb
Soshanguve 
Atamelang street",
seanekelebogile20@gmail.com,Kelebogile,+27679184606,"220 Madiba Street
Pretoria central",
sibongilemahlangu080@gmail.com,Sibongile Fortunate Mahlangu,0764675907,"465 Block Aa
Soshanguve 
0152
",
sisiphomakade@gmail.com,sisipho,0632515828,6645 joel gumede street,
tebogokarabomatlou@gmail.com,Tebogo Matlou,0762969755,1643 block GG Soshanguve 0152,
thandazilesilinda40@gmail.com,thandazile,0764816919,147 Johnston street,
Tibanenhlalala@gmail.com, Nhlalala Tibane ,0765274139,Telkom residence soshanguve block H ,
tshegofatsonozipho@gmail.com,tshegofatso,+27681728486,,
tshegohutang@hotmail.com,Tshegofatso ,0735264207,,
Tshepisokmanamela@gmail.com,Tshepiso ,0760984210 ,Tshepisokmanamela@gmail.com ,
tswaimmathapelo@gmail.com,Mmathapelo ,0619260360,1397 block A mabopane,
vuyisile.queen@gmail.com,vuyisile,0760421513,166 Block G,`;

function parseLatestCSV() {
    const lines = latestCSV.trim().split('\n');
    const clients = [];
    
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;
        
        // Parse CSV with quoted fields
        const fields = [];
        let current = '';
        let inQuotes = false;
        
        for (let j = 0; j < line.length; j++) {
            const char = line[j];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                fields.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        fields.push(current.trim());
        
        if (fields.length >= 4) {
            clients.push({
                email: fields[0],
                name: fields[1],
                mobile: fields[2],
                address: fields[3],
                memberId: fields[4] || null
            });
        }
    }
    
    return clients;
}

function integrateLatestData() {
    console.log('🔄 INTEGRATING LATEST CSV CLIENT DATA');
    console.log('====================================\n');
    
    // Load existing data
    const existingData = JSON.parse(fs.readFileSync('instyle-integrated-data.json', 'utf8'));
    const latestClients = parseLatestCSV();
    
    console.log(`📊 Latest CSV Clients: ${latestClients.length}`);
    console.log(`📊 Existing SuperSaaS Clients: ${existingData.clients.length}`);
    
    // Compare and merge client data
    const mergedClients = [...existingData.clients];
    let newClients = 0;
    let updatedClients = 0;
    
    latestClients.forEach(csvClient => {
        const existing = mergedClients.find(c => 
            c.email.toLowerCase() === csvClient.email.toLowerCase()
        );
        
        if (existing) {
            // Update existing client with latest data
            if (csvClient.mobile && csvClient.mobile !== existing.phone) {
                existing.phone = csvClient.mobile;
                updatedClients++;
            }
            if (csvClient.address && csvClient.address !== existing.address) {
                existing.address = csvClient.address;
            }
        } else {
            // Add new client
            mergedClients.push({
                id: `csv_${Date.now()}_${newClients}`,
                name: csvClient.name,
                email: csvClient.email,
                phone: csvClient.mobile,
                address: csvClient.address,
                createdAt: new Date().toISOString(),
                isActive: true,
                source: 'latest_csv'
            });
            newClients++;
        }
    });
    
    // Analyze geographic distribution
    const locations = {};
    mergedClients.forEach(client => {
        if (client.address) {
            const addr = client.address.toLowerCase();
            if (addr.includes('soshanguve')) locations.soshanguve = (locations.soshanguve || 0) + 1;
            else if (addr.includes('mabopane')) locations.mabopane = (locations.mabopane || 0) + 1;
            else if (addr.includes('pretoria')) locations.pretoria = (locations.pretoria || 0) + 1;
            else if (addr.includes('tut')) locations.tut = (locations.tut || 0) + 1;
            else locations.other = (locations.other || 0) + 1;
        }
    });
    
    // Update integrated data
    const updatedData = {
        ...existingData,
        timestamp: new Date().toISOString(),
        clients: mergedClients,
        dataSources: {
            ...existingData.dataSources,
            latestCSV: {
                clients: latestClients.length,
                newClients,
                updatedClients
            }
        },
        insights: {
            ...existingData.insights,
            totalClients: mergedClients.length,
            geographicDistribution: locations,
            clientSources: {
                supersaas: existingData.clients.length,
                latestCSV: newClients
            }
        }
    };
    
    // Save updated data
    fs.writeFileSync('instyle-final-integrated-data.json', JSON.stringify(updatedData, null, 2));
    
    console.log('\n📈 INTEGRATION RESULTS:');
    console.log(`Total Clients: ${mergedClients.length}`);
    console.log(`New Clients Added: ${newClients}`);
    console.log(`Existing Clients Updated: ${updatedClients}`);
    
    console.log('\n🗺️ GEOGRAPHIC DISTRIBUTION:');
    Object.entries(locations).forEach(([location, count]) => {
        console.log(`${location}: ${count} clients`);
    });
    
    console.log('\n💾 Final integrated data saved to: instyle-final-integrated-data.json');
    console.log('✅ LATEST CSV INTEGRATION COMPLETE');
    
    return updatedData;
}

integrateLatestData();