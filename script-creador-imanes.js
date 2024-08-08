document.getElementById('imageInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file && file.type === 'image/png') {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                const imageData = ctx.getImageData(0, 0, img.width, img.height);
                const pixels = imageData.data;
                let html = `
<table>
<style>
    table {
        border-collapse: collapse;
    }
    td {
        width: 20px; /* Doble tamaño */
        height: 20px;
        border: 1px solid #ccc;
    }
</style>
`;

                for (let y = 0; y < img.height; y++) {
                    html += '    <tr>\n';
                    for (let x = 0; x < img.width; x++) {
                        const index = (y * img.width + x) * 4;
                        const r = pixels[index];
                        const g = pixels[index + 1];
                        const b = pixels[index + 2];
                        const color = `rgb(${r},${g},${b})`;
                        html += `        <td style="background-color: ${color};"></td>\n`;
                    }
                    html += '    </tr>\n';
                }

                html += '</table>';
                document.getElementById('pixelTable').innerHTML = html;
                document.getElementById('generatedCode').value = html;
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('copyButton').addEventListener('click', function() {
    const codeArea = document.getElementById('generatedCode');
    codeArea.select();
    document.execCommand('copy');
    alert('Código copiado al portapapeles');
});