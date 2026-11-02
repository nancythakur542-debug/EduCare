document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chatForm');
    if (chatForm) {
        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const input = document.getElementById('chatInput');
            const container = document.getElementById('chatMessages');
            const message = input.value.trim();
            const conversationId = document.getElementById('conversationId').value;

            if (!message) return;

            const userBubble = document.createElement('div');
            userBubble.className = 'd-flex justify-content-end mb-3';
            userBubble.innerHTML = `<div class="p-3 rounded bg-primary text-white" style="max-width: 70%;">${message}</div>`;
            container.appendChild(userBubble);
            input.value = '';
            container.scrollTop = container.scrollHeight;

            try {
                const response = await fetch('/student/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message, conversationId })
                });
                const data = await response.json();

                const aiBubble = document.createElement('div');
                aiBubble.className = 'd-flex justify-content-start mb-3';
                aiBubble.innerHTML = `<div class="p-3 rounded card" style="max-width: 70%;">${data.reply}</div>`;
                container.appendChild(aiBubble);
                container.scrollTop = container.scrollHeight;

                if (data.crisis) {
                    const crisisModal = new bootstrap.Modal(document.getElementById('crisisModal'));
                    crisisModal.show();
                }
            } catch (err) {
                console.error('Chat error');
            }
        });
    }
});