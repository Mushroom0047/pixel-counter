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
        width: 50px; /* Doble tamaño */
        height: 50px;
        border: 1px solid #ccc;
        text-align: center;
        font-size: 12px;
        color: #000;
    }
</style>
`;

                const colorMap = {};
                let colorCounter = 1;
                let colorLegendHtml = '<div style="display: flex; flex-wrap: wrap;">';

                for (let y = 0; y < img.height; y++) {
                    html += '    <tr>\n';
                    for (let x = 0; x < img.width; x++) {
                        const index = (y * img.width + x) * 4;
                        const r = pixels[index];
                        const g = pixels[index + 1];
                        const b = pixels[index + 2];
                        const color = `rgb(${r},${g},${b})`;

                        if (!colorMap[color]) {
                            colorMap[color] = colorCounter++;
                        }

                        const colorNumber = colorMap[color];
                        html += `        <td style="background-color: ${color};">${colorNumber}</td>\n`;
                    }
                    html += '    </tr>\n';
                }

                html += '</table>';

                for (const [color, number] of Object.entries(colorMap)) {
                    colorLegendHtml += `
                    <div style="display: inline-block; text-align: center; margin: 5px;">
                        <div style="width: 20px; height: 20px; background-color: ${color}; border: 1px solid #000;"></div>
                        <div>${number}</div>
                    </div>`;
                }

                colorLegendHtml += '</div>';

                const fullHtml = html + colorLegendHtml;

                document.getElementById('pixelTable').innerHTML = fullHtml;
                document.getElementById('generatedCode').value = fullHtml;
                document.getElementById('colorMap').innerHTML = colorLegendHtml;
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