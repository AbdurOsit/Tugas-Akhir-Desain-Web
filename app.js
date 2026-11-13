$(function() {
    let totalSaldo = 0;

    // 1. Memanggil data profil dari users.json menggunakan AJAX
    $.ajax({
        url: 'data/users.json',
        method: 'GET',
        dataType: 'json'
    }).done(function(data) {
        $('#nama-user').text(data.nama);
        $('#lokasi-user').text(data.lokasi);
    }).fail(function() {
        console.log("Gagal memuat users.json");
    });

    // 2. Memanggil data transaksi awal dari products.json menggunakan AJAX
    $.ajax({
        url: 'data/products.json',
        method: 'GET',
        dataType: 'json'
    }).done(function(data) {
        // Melakukan looping (iterasi) untuk setiap data transaksi awal
        $.each(data, function(index, item) {
            tambahTransaksiKeDOM(item.jenis, item.keterangan, item.nominal);
        });
    }).fail(function() {
        console.log("Gagal memuat products.json");
    });

    // 3. Event Handler untuk Form Transaksi Baru
    $('#formKeuangan').on('submit', function(e) {
        e.preventDefault(); 
        
        let jenis = $('#jenisTransaksi').val();
        let keterangan = $('#inputKeterangan').val().trim();
        let nominal = parseInt($('#inputNominal').val());
        let adaError = false;

        // Validasi
        if (keterangan === "") {
            $('#errorKeterangan').show();
            adaError = true;
        } else {
            $('#errorKeterangan').hide();
        }

        if (isNaN(nominal) || nominal <= 0) {
            $('#errorNominal').show();
            adaError = true;
        } else {
            $('#errorNominal').hide();
        }

        // Jika form valid, tambahkan transaksi
        if (!adaError) {
            tambahTransaksiKeDOM(jenis, keterangan, nominal);
            this.reset();
            $('#inputKeterangan').focus();
        }
    });

    // 4. Fungsi Reusable untuk Manipulasi DOM
    function tambahTransaksiKeDOM(jenis, keterangan, nominal) {
        let elemenList = '';

        if (jenis === 'masuk') {
            totalSaldo += nominal;
            elemenList = `
                <li class="uang-masuk">
                    <span>${keterangan}</span>
                    <span class="nominal-masuk">+ Rp ${nominal.toLocaleString('id-ID')}</span>
                </li>
            `;
        } else {
            totalSaldo -= nominal;
            elemenList = `
                <li class="uang-keluar">
                    <span>${keterangan}</span>
                    <span class="nominal-keluar">- Rp ${nominal.toLocaleString('id-ID')}</span>
                </li>
            `;
        }

        // Update teks total saldo
        $('#text-saldo').text(totalSaldo.toLocaleString('id-ID'));
        
        // Sisipkan ke baris paling atas di list (.prepend)
        $('#listRiwayat').prepend(elemenList);
    }
});