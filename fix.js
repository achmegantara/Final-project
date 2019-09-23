//memasukkan library firebase admin
var admin = require("firebase-admin");

//service account key
var serviceAccount = require("./visualization-17549-firebase-adminsdk-sexbx-b3451e7d73.json");

//credential dan url alamt dari database
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://visualization-17549.firebaseio.com/"
});

//login menuju databse
admin.database.enableLogging(true);

//memanggil database
var db = admin.database();

//alamat database
var ref = db.ref("PROYEK AKHIR");

//memanggil nilai di dalam database
ref.child("Data Mentah").on("value", function(snapshot) {

    snapshot.forEach(function(childSnapshot) {
        //memanggil nama user dari tiap user yang masuk
        var namauser = childSnapshot.key;

        //memanggil nilai - nilai dari tiap database
        var a = childSnapshot.child("acceleroX").val(); //nilai acceleroX
        var b = childSnapshot.child("acceleroY").val(); //nilai acceleroY
        var c = childSnapshot.child("acceleroZ").val(); //nilai acceleroZ
        var d = childSnapshot.child("accellinearx").val(); //nilai accellinierX
        var e = childSnapshot.child("accellineary").val(); //nilai accellinierY
        var f = childSnapshot.child("accellinearz").val(); //nilai accellinierZ
        var g = childSnapshot.child("azimuth").val(); //nilai orienX
        var h = childSnapshot.child("pitch").val(); //nilai orienY
        var i = childSnapshot.child("roll").val(); //nilai orienZ

        //parsing nilai dari string ke float
        var accelx = parseFloat(a);
        var accely = parseFloat(b);
        var accelz = parseFloat(c);

        var accellinierx = parseFloat(d);
        var accelliniery = parseFloat(e);
        var accellinierz = parseFloat(f);

        var azimuth = parseFloat(g);
        var pitch = parseFloat(h);
        var roll = parseFloat(i);

        //metode untuk menghadap
        //metode multidimensional scaling

        //inisialisasi nilai referensi
        var arahsudut = [0, 45, 90, 135, 180, 225, 270, 315];
        var arahmataangin = ['utara', 'barat laut', 'barat', 'barat daya', 'selatan', 'tenggara', 'timur', 'timur laut'];
        var i = 0;
        var j = 0;
        var pengurangan;
        var euclidean = [];

        //menghitung nilai euclidean
        for (i; i < arahsudut.length; i++) {
            pengurangan = Math.abs(azimuth - arahsudut[i]);
            euclidean[i] = pengurangan;
        }

        //mencari nilai jarak terdekat
        var min = Math.min.apply(Math, euclidean);

        //mencari posisi nilai terdekat pada indeks berapa
        for (j; j < euclidean.length; j++) {
            if (euclidean[j] == min) {
                var urutanterkecil = j;
            }
        }

        //menentukan arah sesuai indeks
        var arah = arahmataangin[urutanterkecil];

        // console.log(euclidean);
        // console.log(min);
        // console.log("User sedang menghadap "+arah);

        //metode fuzzy untuk menentukan kecepatan berjalan
        //inisialisasi variabel
        var batasawal = 0;
        var batasakhir = 30;
        var arraykeanggotaan = [];
        var derajatkeanggotaanx;
        var derajatkeanggotaany;
        var derajatkeanggotaanz;
        var terbesar;

        //mengabsolutkan nilai
        var nilaix = Math.abs(accellinierx);
        var nilaiy = Math.abs(accelliniery);
        var nilaiz = Math.abs(accellinierz);

        //rumus menghitung derajat keanggotaan
        //sumbu x
        derajatkeanggotaanx = (nilaix - batasawal) / (batasakhir - batasawal);
        //sumbu y
        derajatkeanggotaany = (nilaiy - batasawal) / (batasakhir - batasawal);
        //sumbu z
        derajatkeanggotaanz = (nilaiz - batasawal) / (batasakhir - batasawal);

        //memasukkan ke dalam array
        arraykeanggotaan[0] = derajatkeanggotaanx;
        arraykeanggotaan[1] = derajatkeanggotaany;
        arraykeanggotaan[2] = derajatkeanggotaanz;

        //mencari nilai terbesar
        terbesar = Math.max.apply(Math, arraykeanggotaan);

        var activity;
        if (terbesar >= 0 && terbesar <= 0.03) {
            activity = "diam";
        } else if (terbesar > 0.03 && terbesar <= 0.167) {
            activity = "berjalan pelan";
        } else if (terbesar > 0.167 && terbesar <= 0.34) {
            activity = "berjalan cepat";
        } else if (terbesar > 0.34 && terbesar <= 1) {
            activity = "berlari";
        }


        visualisasi(namauser, arah, activity);
    });

}, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
});


function visualisasi(namauser, arah, activity) {
    var namaobjek = namauser;
    var arahmenghadap = arah;
    var aktifitasuser = activity;

    console.log(namaobjek + " sedang " + aktifitasuser + " menghadap " + arahmenghadap);

    var newPostRef = ref.child("Hasil").child(namaobjek);
    newPostRef.set({
        namauser: namaobjek,
        arah: arahmenghadap,
        aktifitas: aktifitasuser
    });

}