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
<div style="max-width: 400px;">
                <table>
<style>
    table {
        border-collapse: collapse;
    }
    td {
        width: 50px;
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
                            colorMap[color] = {
                                id: colorCounter++,
                                count: 0
                            };
                        }

                        colorMap[color].count++;

                        const colorNumber = colorMap[color].id;

                        // Verificar si el fondo es negro
                        const textColor = (r + g + b < 128 * 3) ? '#FFFFFF' : '#000000';

                        html += `        <td style="background-color: ${color}; color: ${textColor};">${colorNumber}</td>\n`;
                    }
                    html += '    </tr>\n';
                }

                html += '</table>';

                for (const [color, data] of Object.entries(colorMap)) {
                    colorLegendHtml += `
                    <div style="display:flex; flex-flow: column nowrap; justify-content: center; align-items: center; text-align: center; margin: 5px;">
                        <div style="width: 30px; height: 30px; background-color: ${color}; border: 1px solid #000; display:flex; justify-content: center; align-items: center;">
                            ${data.id}
                        </div>
                        <div>${data.count} Piezas</div>
                    </div></div>`;
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
