document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('delete').addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        fetch(`/article/${id}`, {
                method: "DELETE"
            })
            .then(res => {
                alert(`Deleting article with id: ${id}`);
                window.location.href = '/';
            })
            .catch(err => {
                console.log(err);
            })
    })
});