const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('E:/all-demo/chouyin-tower/index.html', 'utf8');
const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
let m, idx = 0, errors = 0;
while ((m = re.exec(html)) !== null) {
  const attrs = m[1] || '';
  const code = m[2] || '';
  idx++;
  if (/\bsrc\s*=/.test(attrs)) {
    console.log('script #' + idx + ': external (skipped) ' + attrs.trim());
    continue;
  }
  if (!code.trim()) { console.log('script #' + idx + ': empty'); continue; }
  try {
    new vm.Script(code, { filename: 'inline-script-' + idx + '.js' });
    console.log('script #' + idx + ': OK (' + code.length + ' chars)');
  } catch (e) {
    errors++;
    console.log('script #' + idx + ': SYNTAX ERROR -> ' + e.message);
  }
}
console.log('---');
console.log('total inline scripts checked, errors=' + errors);
process.exit(errors ? 1 : 0);
