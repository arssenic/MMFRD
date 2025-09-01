export async function uploadImage(imageBlob) {
  const formData = new FormData();
  formData.append('image', imageBlob);

  const res = await fetch('http://127.0.0.1:5000/predict', {
    method: 'POST',
    body: formData
  });

  return await res.json();
}
