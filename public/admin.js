document.addEventListener("DOMContentLoaded", function() {
/*document.querySelector('#add-product-button').addEventListener('click', async () => {
  const name = prompt('Introdu numele produsului:');
  const description = prompt('Introdu descrierea produsului:');
  const price = parseFloat(prompt('Introdu prețul produsului (RON):'));

  if (!name || !description || isNaN(price)) {
    console.error('Date invalide pentru produs.');
    return;
  }

  const response = await fetch('/adauga', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, description, price }),
  });

  if (response.ok) {
    window.location.reload();
  } else {
    console.error('Eroare la adăugarea produsului');
  }
}); */
        // Editarea unui produs
          document.querySelectorAll('.edit-product-button').forEach((button) => {
            button.addEventListener('click', async () => {
              const productId = button.getAttribute('data-id');
              const newDescription = prompt('Introdu noua descriere pentru produs:');

              if (newDescription !== null) { // Dacă utilizatorul nu apasă "Anulează" în prompt
                const response = await fetch(`/editeaza/${productId}`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ description: newDescription }),
                });

                if (response.ok) {
                  window.location.reload();
                } else {
                  console.error('Eroare la editarea produsului');
                }
              }
            });
          });
        
// Ștergerea unui produs
document.querySelectorAll('.delete-product-button').forEach((button) => {
  button.addEventListener('click', async () => {
    const productId = button.getAttribute('data-id');
    console.log('ID-ul produsului de șters:', productId); // Adaugă acest rând pentru a verifica ID-ul

    const response = await fetch(`/sterge/${productId}`, {
      method: 'POST',
    });

    if (response.ok) {
      window.location.reload();
    } else {
      console.error('Eroare la ștergerea produsului');
    }
  });
});

});