

     const rawData = sessionStorage.getItem('dqResult');
    const data = JSON.parse(rawData);
    console.log(data); 
    const successBanner = document.getElementById('successBanner');
    successBanner.textContent = data.message ;
    successBanner.style.display = 'block';
    const urlParams = new URLSearchParams(window.location.search);
    if(urlParams.get('success') === 'true'){
        document.getElementById('successBanner').style.display = 'block';
    }

    const downloadBlob = (blob, filename) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    };

    const showStatus = (elementId, message, isError = false) => {
        const el = document.getElementById(elementId);
        el.textContent = message;
        el.style.display = 'block';
        el.className = `status ${isError ? 'error' : 'success'}`;
    };

    document.getElementById('predictForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('btnPredict');
        
        const formData = new FormData();
        // Only sending data file, model is on server
        formData.append('data_file', document.getElementById('predictDataFile').files[0]);

        btn.disabled = true;
        btn.textContent = "Processing...";

        try {
            const response = await fetch('/api/predict', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.detail || 'Prediction failed');
            }

            const blob = await response.blob();
            downloadBlob(blob, 'prediction_results.csv');
            showStatus('predictStatus', 'Success! Predictions downloaded.');
        } catch (error) {
            showStatus('predictStatus', error.message, true);
        } finally {
            btn.disabled = false;
            btn.textContent = "Predict & Download Results";
        }
    });