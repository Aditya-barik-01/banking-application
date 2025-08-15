document.querySelector('#contactform').addEventListener('submit', async function(event) {
    event.preventDefault();
    const formData = {
        name: this.name.value,
        email: this.email.value,
        comment: this.comment.value
    };
    const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.text();
      alert(data);
      this.reset();
});