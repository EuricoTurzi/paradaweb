/*
 * Impede o envio duplicado de qualquer formulário do sistema.
 * Ao primeiro submit, o formulário é marcado como "enviando"; qualquer
 * novo submit (duplo-clique, Enter repetido) é bloqueado e os botões de
 * envio são desabilitados.
 *
 * Respeita a validação: se o navegador ou outro script cancelar o envio
 * (validação nativa ou preventDefault), o formulário é liberado de novo
 * para o usuário corrigir e reenviar.
 *
 * Para permitir múltiplos envios num formulário específico, basta
 * adicionar o atributo data-allow-multiple na tag <form>.
 */
(function () {
  "use strict";

  function desabilitarBotoes(form) {
    var botoes = form.querySelectorAll(
      'button[type="submit"], input[type="submit"], button:not([type])'
    );
    botoes.forEach(function (btn) {
      btn.disabled = true;
      btn.setAttribute("aria-disabled", "true");
      // Troca o texto por "Enviando..." mantendo o original para referência.
      if (btn.tagName === "BUTTON" && !btn.dataset.textoOriginal) {
        btn.dataset.textoOriginal = btn.innerHTML;
        btn.innerHTML = "Enviando…";
      }
    });
  }

  document.addEventListener(
    "submit",
    function (event) {
      var form = event.target;
      if (!(form instanceof HTMLFormElement)) {
        return;
      }
      // Opt-out explícito por formulário.
      if (form.hasAttribute("data-allow-multiple")) {
        return;
      }

      // Já está enviando: bloqueia qualquer envio adicional.
      if (form.dataset.submitting === "true") {
        event.preventDefault();
        return;
      }

      // Marca imediatamente para barrar o duplo-clique no mesmo instante.
      form.dataset.submitting = "true";

      // No próximo tick, após todos os handlers síncronos rodarem:
      window.setTimeout(function () {
        if (event.defaultPrevented) {
          // Envio cancelado (validação/outro script): libera para reenviar.
          form.dataset.submitting = "";
          return;
        }
        // Envio real em andamento: desabilita os botões.
        desabilitarBotoes(form);
      }, 0);
    },
    false
  );
})();
