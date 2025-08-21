document.addEventListener('DOMContentLoaded', function () {
  const phone = document.getElementById('fone');
  const doc   = document.getElementById('cpfCnpj');

  function digits(s){ return (s || '').replace(/\D/g, ''); }

  // --------- Telefone BR (10 ou 11 dígitos) ---------
  function formatPhone(value){
    const d = digits(value).slice(0, 11);
    if (d.length === 0) return '';
    if (d.length <= 2)  return `(${d}`;
    if (d.length <= 6)  return `(${d.slice(0,2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`; // fixo
    return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;                     // celular
  }

  // --------- CPF/CNPJ auto ---------
  function formatCpfCnpj(value){
    const d = digits(value);
    if (d.length <= 11){
      const s = d.slice(0,11);
      if (s.length <= 3)  return s;
      if (s.length <= 6)  return `${s.slice(0,3)}.${s.slice(3)}`;
      if (s.length <= 9)  return `${s.slice(0,3)}.${s.slice(3,6)}.${s.slice(6)}`;
      return `${s.slice(0,3)}.${s.slice(3,6)}.${s.slice(6,9)}-${s.slice(9)}`;
    } else {
      const s = d.slice(0,14);
      if (s.length <= 2)   return s;
      if (s.length <= 5)   return `${s.slice(0,2)}.${s.slice(2)}`;
      if (s.length <= 8)   return `${s.slice(0,2)}.${s.slice(2,5)}.${s.slice(5)}`;
      if (s.length <= 12)  return `${s.slice(0,2)}.${s.slice(2,5)}.${s.slice(5,8)}/${s.slice(8)}`;
      return `${s.slice(0,2)}.${s.slice(2,5)}.${s.slice(5,8)}/${s.slice(8,12)}-${s.slice(12)}`;
    }
  }

  function bindMask(el, formatter){
    if (!el) return;
    const apply = () => { el.value = formatter(el.value); };
    el.addEventListener('input', apply);
    el.addEventListener('blur', apply);
    el.addEventListener('paste', () => requestAnimationFrame(apply));
    // normaliza se já vier valor do autofill
    apply();
  }

  bindMask(phone,   formatPhone);
  bindMask(doc,     formatCpfCnpj);
});

