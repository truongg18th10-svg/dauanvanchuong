/* Đăng nhập & phân quyền (Firebase Auth + Firestore). Cấu hình trong firebase-config.js */
(function () {
  'use strict';
  const $ = s => document.querySelector(s);
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const toast = m => window.showToast && window.showToast(m);
  const btn = $('#authBtn');
  const sbtn = $('#signupBtn');
  const cfg = window.FIREBASE_CONFIG || {};
  if (!window.firebase || !cfg.apiKey || /^PASTE_/.test(cfg.apiKey)) {
    [btn, sbtn].forEach(b => b && b.addEventListener('click', () => toast('Đăng nhập chưa được bật: cần điền firebase-config.js (xem HUONG_DAN_TAI_KHOAN.md).')));
    return;
  }
  firebase.initializeApp(cfg);
  const auth = firebase.auth(), db = firebase.firestore();
  const TS = () => firebase.firestore.FieldValue.serverTimestamp();
  const ROLES = { superadmin: 'Super Admin', admin: 'Admin', teacher: 'Giáo viên', content_writer: 'Người viết nội dung', member: 'Chờ cấp quyền' };
  const GRADES = ['6', '7', '8', '9'];
  let me = null;
  const isAdmin = () => !!me && ['superadmin', 'admin'].includes(me.role);
  const canWrite = () => !!me && ['superadmin', 'admin', 'teacher', 'content_writer'].includes(me.role);
  const canModerate = () => isAdmin();
  const ERR = { 'permission-denied': 'Bạn không có quyền thực hiện thao tác này.', 'auth/invalid-credential': 'Email hoặc mật khẩu chưa đúng.', 'auth/wrong-password': 'Email hoặc mật khẩu chưa đúng.', 'auth/user-not-found': 'Email hoặc mật khẩu chưa đúng.', 'auth/email-already-in-use': 'Email này đã được đăng ký.', 'auth/weak-password': 'Mật khẩu cần ít nhất 6 ký tự.', 'auth/invalid-email': 'Email không hợp lệ.', 'auth/too-many-requests': 'Thử quá nhiều lần, vui lòng đợi một lát.' };
  const errMsg = e => ERR[e && e.code] || 'Có lỗi xảy ra, vui lòng thử lại.';
  const secs = x => (x && x.updatedAt && x.updatedAt.seconds) || (x && x.createdAt && x.createdAt.seconds) || 0;

  /* ---------- Nội dung bài học công khai (đã duyệt) ---------- */
  const BASE = JSON.stringify(window.LV_DATA.grades);
  function loadContent() {
    return db.collection('lessons').where('status', '==', 'published').get().then(snap => {
      const g = JSON.parse(BASE);
      snap.forEach(doc => {
        const d = doc.data(), list = g[d.grade];
        if (!list) return;
        const t = list.find(x => x.title === d.title);
        if (t) { if (d.summary) t.summary = d.summary; if (d.part2) t.part2 = d.part2; }
        else list.push({ title: d.title, summary: d.summary || '', part2: d.part2 || '' });
      });
      window.LV_DATA.grades = g;
      if (window.LV_REFRESH) window.LV_REFRESH();
    }).catch(() => { });
  }

  /* ---------- Cảm nhận (học sinh không cần tài khoản) ---------- */
  window.submitReflection = function (e) {
    e.preventDefault();
    const f = e.target, name = $('#reader').value.trim(), thought = $('#thought').value.trim(), trap = $('#website').value;
    if (trap) return;
    if (!name || thought.length < 5) { toast('Vui lòng nhập tên và cảm nhận (ít nhất vài chữ).'); return; }
    const b = f.querySelector('button[type="submit"]'); b.disabled = true; b.textContent = 'Đang gửi…';
    db.collection('reflections').add({ name: name.slice(0, 60), thought: thought.slice(0, 1500), status: 'pending', createdAt: TS() })
      .then(() => { toast('Cảm ơn ' + name + '! Cảm nhận đã được gửi và đang chờ duyệt.'); f.reset(); })
      .catch(() => toast('Chưa gửi được. Vui lòng thử lại sau.'))
      .finally(() => { b.disabled = false; b.textContent = 'Gửi cảm nhận ↗'; });
  };
  function loadReflections() {
    const root = $('#approvedReflections'); if (!root) return;
    db.collection('reflections').where('status', '==', 'approved').limit(50).get().then(s => {
      const items = s.docs.map(d => d.data()).sort((a, b) => secs(b) - secs(a));
      root.innerHTML = items.length ? items.map(i => `<article class="approved-item"><strong>${esc(i.name)}</strong><p>${esc(i.thought)}</p></article>`).join('') : '<p style="color:var(--muted);font-size:15px">Chưa có cảm nhận được công khai.</p>';
    }).catch(() => { });
  }

  /* ---------- Cửa sổ ---------- */
  function mount(id, html) {
    let el = document.getElementById(id);
    if (!el) { el = document.createElement('div'); el.id = id; el.className = 'lv-modal-backdrop'; document.body.append(el); el.addEventListener('click', ev => { if (ev.target === el) el.classList.remove('open'); }); }
    el.innerHTML = html; el.classList.add('open'); return el;
  }
  const close = id => { const el = document.getElementById(id); if (el) el.classList.remove('open'); };
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { close('acLogin'); close('acPanel'); } });

  function openLogin(mode) {
    const reg = mode === 'up';
    const el = mount('acLogin', `<section class="lv-modal ac-modal" role="dialog" aria-modal="true" aria-label="Tài khoản">
      <header class="lv-modal-head"><div><div class="eyebrow">Tài khoản</div><h3>${reg ? 'Đăng ký tài khoản' : 'Đăng nhập'}</h3>
      <p>${reg ? 'Dành cho giáo viên và người viết nội dung. Sau khi đăng ký, super admin sẽ cấp vai trò. Học sinh không cần tài khoản.' : 'Dành cho ban quản trị, giáo viên và người viết nội dung.'}</p></div>
      <button class="lv-close" type="button" data-x aria-label="Đóng">×</button></header>
      <div class="lv-modal-content"><form class="formbox">
      ${reg ? '<label for="acName">Họ và tên</label><input id="acName" required maxlength="60" autocomplete="name">' : ''}
      <label for="acMail">Email</label><input id="acMail" type="email" required autocomplete="email">
      <label for="acPass">Mật khẩu</label><input id="acPass" type="password" required minlength="6" autocomplete="${reg ? 'new-password' : 'current-password'}">
      <p class="ac-msg" id="acMsg" role="alert"></p>
      <button class="btn" type="submit">${reg ? 'Tạo tài khoản' : 'Đăng nhập'} ↗</button>
      <p class="ac-alt"><button type="button" class="ac-link" data-sw>${reg ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký'}</button>${reg ? '' : ' · <button type="button" class="ac-link" data-reset>Quên mật khẩu</button>'}</p>
      </form></div></section>`);
    el.querySelector('[data-x]').onclick = () => close('acLogin');
    el.querySelector('[data-sw]').onclick = () => openLogin(reg ? 'in' : 'up');
    const rs = el.querySelector('[data-reset]');
    if (rs) rs.onclick = () => {
      const m = $('#acMail').value.trim();
      if (!m) { $('#acMsg').textContent = 'Nhập email trước, rồi bấm “Quên mật khẩu”.'; return; }
      auth.sendPasswordResetEmail(m).then(() => { $('#acMsg').textContent = 'Nếu email đã đăng ký, thư đặt lại mật khẩu sẽ được gửi.'; }).catch(x => { $('#acMsg').textContent = errMsg(x); });
    };
    el.querySelector('form').onsubmit = ev => {
      ev.preventDefault();
      const m = $('#acMail').value.trim(), p = $('#acPass').value, msg = $('#acMsg'), b = ev.target.querySelector('.btn');
      msg.textContent = ''; b.disabled = true;
      const job = reg
        ? auth.createUserWithEmailAndPassword(m, p).then(c => { const n = $('#acName').value.trim(); return c.user.updateProfile({ displayName: n }).then(() => db.collection('users').doc(c.user.uid).set({ email: m, name: n, role: 'member', createdAt: TS() })); })
        : auth.signInWithEmailAndPassword(m, p);
      job.then(() => { close('acLogin'); return refreshMe(); }).then(() => { if (me) { toast('Xin chào, ' + me.name + '!'); } })
        .catch(x => { msg.textContent = errMsg(x); }).finally(() => { b.disabled = false; });
    };
  }

  /* ---------- Bảng quản trị ---------- */
  const TABS = () => [canWrite() && ['content', 'Nội dung'], canModerate() && ['reflections', 'Cảm nhận chờ duyệt'], me.role === 'superadmin' && ['users', 'Thành viên']].filter(Boolean);
  function openPanel(tab) {
    const tabs = TABS(), cur = tab || (tabs[0] && tabs[0][0]);
    const el = mount('acPanel', `<section class="lv-modal ac-modal ac-wide" role="dialog" aria-modal="true" aria-label="Bảng quản trị">
      <header class="lv-modal-head"><div><div class="eyebrow">Bảng quản trị</div><h3>${esc(me.name)}</h3>
      <p><span class="ac-badge ac-${me.role}">${ROLES[me.role]}</span> &nbsp;${esc(me.email)}</p></div>
      <div class="ac-head-actions"><button class="lv-clear-btn" type="button" data-out>Đăng xuất</button><button class="lv-close" type="button" data-x aria-label="Đóng">×</button></div></header>
      <div class="lv-modal-content">${tabs.length
        ? `<div class="lv-tabs">${tabs.map(([k, l]) => `<button class="lv-tab ${k === cur ? 'active' : ''}" type="button" data-tab="${k}">${l}</button>`).join('')}</div><div id="acBody"></div>`
        : '<p class="lv-part-note" style="padding:24px 0">Tài khoản của bạn đang chờ super admin cấp vai trò. Sau khi được cấp, hãy đăng xuất rồi đăng nhập lại để dùng các chức năng.</p>'}</div></section>`);
    el.querySelector('[data-x]').onclick = () => close('acPanel');
    el.querySelector('[data-out]').onclick = () => auth.signOut().then(() => { close('acPanel'); toast('Đã đăng xuất.'); });
    el.querySelectorAll('[data-tab]').forEach(t => t.onclick = () => openPanel(t.dataset.tab));
    const views = { content: viewContent, reflections: viewReflections, users: viewUsers };
    if (cur) views[cur]($('#acBody'));
  }
  const fail = x => toast(errMsg(x));

  function viewContent(box, e) {
    e = e || {};
    box.innerHTML = `<form class="formbox" id="acLesson">
      <div class="ac-two"><div><label for="lsGrade">Khối lớp</label><select id="lsGrade">${GRADES.map(g => `<option value="${g}" ${e.grade === g ? 'selected' : ''}>Lớp ${g}</option>`).join('')}</select></div>
      <div><label for="lsTitle">Tên bài học / tác phẩm</label><input id="lsTitle" list="lsTitles" required maxlength="150" value="${esc(e.title || '')}"><datalist id="lsTitles"></datalist></div></div>
      <label for="lsP1">Phần đọc 1 (tóm tắt, giới thiệu)</label><textarea id="lsP1" rows="6" maxlength="20000">${esc(e.summary || '')}</textarea>
      <label for="lsP2">Phần đọc 2 (phân tích, mở rộng)</label><textarea id="lsP2" rows="6" maxlength="20000">${esc(e.part2 || '')}</textarea>
      <p class="ac-hint">${isAdmin() ? 'Bài của admin được đăng ngay. Nếu tên trùng bài có sẵn, nội dung sẽ thay phần đọc của bài đó.' : 'Bài sẽ chờ admin duyệt trước khi hiển thị công khai; sửa lại bài đã đăng cũng cần duyệt lại.'}</p>
      <button class="btn" type="submit">${e.id ? 'Lưu chỉnh sửa' : (isAdmin() ? 'Đăng bài' : 'Gửi duyệt')} ↗</button>
      ${e.id ? ' <button class="btn secondary" type="button" id="lsCancel">Hủy sửa</button>' : ''}
      </form><h4 class="ac-list-title">${isAdmin() ? 'Tất cả bài (chờ duyệt xếp trước)' : 'Bài của tôi'}</h4><div id="acList"><p class="ac-hint">Đang tải…</p></div>`;
    const fill = () => { $('#lsTitles').innerHTML = (window.LV_DATA.grades[$('#lsGrade').value] || []).map(x => `<option value="${esc(x.title)}">`).join(''); };
    fill(); $('#lsGrade').onchange = fill;
    if (e.id) $('#lsCancel').onclick = () => viewContent(box);
    $('#acLesson').onsubmit = ev => {
      ev.preventDefault();
      const data = { grade: $('#lsGrade').value, title: $('#lsTitle').value.trim(), summary: $('#lsP1').value.trim(), part2: $('#lsP2').value.trim(), status: isAdmin() ? 'published' : 'pending', authorUid: e.authorUid || me.uid, authorName: e.authorName || me.name, updatedAt: TS() };
      (e.id ? db.collection('lessons').doc(e.id).set(data) : db.collection('lessons').add(data))
        .then(() => { toast(isAdmin() ? 'Đã đăng nội dung.' : 'Đã gửi, chờ admin duyệt.'); return loadContent(); })
        .then(() => viewContent(box)).catch(fail);
    };
    const q = isAdmin() ? db.collection('lessons') : db.collection('lessons').where('authorUid', '==', me.uid);
    q.get().then(s => {
      const rows = s.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => ((a.status === 'pending' ? 0 : 1) - (b.status === 'pending' ? 0 : 1)) || (secs(b) - secs(a)));
      const list = $('#acList');
      list.innerHTML = rows.length ? rows.map(r => `<div class="ac-row"><div><strong>Lớp ${esc(r.grade)} · ${esc(r.title)}</strong><small>${esc(r.authorName || '')} · ${r.status === 'published' ? 'Đã đăng' : 'Chờ duyệt'}</small></div>
        <div class="ac-actions">${isAdmin() && r.status !== 'published' ? `<button type="button" data-ok="${r.id}">Duyệt</button>` : ''}<button type="button" data-ed="${r.id}">Sửa</button>${isAdmin() ? `<button type="button" data-del="${r.id}">Xóa</button>` : ''}</div></div>`).join('') : '<p class="ac-hint">Chưa có bài nào.</p>';
      list.onclick = ev => {
        const t = ev.target.closest('button'); if (!t) return;
        const done = () => loadContent().then(() => viewContent(box));
        if (t.dataset.ok) db.collection('lessons').doc(t.dataset.ok).update({ status: 'published' }).then(done).catch(fail);
        else if (t.dataset.del) { if (confirm('Xóa bài này? Thao tác không hoàn tác được.')) db.collection('lessons').doc(t.dataset.del).delete().then(done).catch(fail); }
        else if (t.dataset.ed) viewContent(box, rows.find(r => r.id === t.dataset.ed));
      };
    }).catch(x => { $('#acList').innerHTML = `<p class="ac-msg">${esc(errMsg(x))}</p>`; });
  }

  function viewReflections(box) {
    box.innerHTML = '<p class="ac-hint">Đang tải…</p>';
    db.collection('reflections').where('status', '==', 'pending').get().then(s => {
      const rows = s.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => secs(a) - secs(b));
      box.innerHTML = rows.length ? rows.map(r => `<div class="ac-row"><div><strong>${esc(r.name)}</strong><p>${esc(r.thought)}</p></div><div class="ac-actions"><button type="button" data-ok="${r.id}">Duyệt</button><button type="button" data-no="${r.id}">Từ chối</button></div></div>`).join('') : '<p class="ac-hint">Không có cảm nhận nào đang chờ duyệt.</p>';
      box.onclick = ev => {
        const t = ev.target.closest('button'); if (!t) return;
        const id = t.dataset.ok || t.dataset.no, status = t.dataset.ok ? 'approved' : 'rejected';
        db.collection('reflections').doc(id).update({ status }).then(() => { loadReflections(); viewReflections(box); }).catch(fail);
      };
    }).catch(x => { box.innerHTML = `<p class="ac-msg">${esc(errMsg(x))}</p>`; });
  }

  function viewUsers(box) {
    box.innerHTML = '<p class="ac-hint">Đang tải…</p>';
    db.collection('users').get().then(s => {
      const rows = s.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (a.role === 'member' ? 0 : 1) - (b.role === 'member' ? 0 : 1) || secs(b) - secs(a));
      box.innerHTML = '<p class="ac-hint">Người mới đăng ký ở mức “Chờ cấp quyền” (xếp trước). Chọn vai trò để cấp quyền.</p>' + rows.map(u => {
        const fixed = u.role === 'superadmin' || u.id === me.uid;
        return `<div class="ac-row"><div><strong>${esc(u.name || '(chưa đặt tên)')}</strong><small>${esc(u.email)}</small></div>
          ${fixed ? `<span class="ac-badge ac-${esc(u.role)}">${esc(ROLES[u.role] || u.role)}</span>` : `<select data-uid="${u.id}">${['member', 'content_writer', 'teacher', 'admin'].map(r => `<option value="${r}" ${u.role === r ? 'selected' : ''}>${ROLES[r]}</option>`).join('')}</select>`}</div>`;
      }).join('');
      box.onchange = ev => {
        const sel = ev.target.closest('select[data-uid]'); if (!sel) return;
        db.collection('users').doc(sel.dataset.uid).update({ role: sel.value }).then(() => toast('Đã cập nhật vai trò.')).catch(x => { fail(x); viewUsers(box); });
      };
    }).catch(x => { box.innerHTML = `<p class="ac-msg">${esc(errMsg(x))}</p>`; });
  }

  /* ---------- Trạng thái đăng nhập ---------- */
  function paint() {
    if (sbtn) sbtn.hidden = !!me;
    if (!btn) return;
    btn.textContent = me ? `${me.name} · ${ROLES[me.role]}` : 'Đăng nhập';
    btn.classList.toggle('on', !!me);
  }
  function refreshMe() {
    const u = auth.currentUser;
    if (!u) { me = null; paint(); return Promise.resolve(); }
    return db.collection('users').doc(u.uid).get()
      .then(s => { const d = s.exists ? s.data() : {}; me = { uid: u.uid, email: u.email, name: d.name || u.displayName || u.email, role: d.role || 'member' }; })
      .catch(() => { me = { uid: u.uid, email: u.email, name: u.displayName || u.email, role: 'member' }; })
      .then(paint);
  }
  if (btn) btn.addEventListener('click', () => (me ? openPanel() : openLogin('in')));
  if (sbtn) sbtn.addEventListener('click', () => openLogin('up'));
  auth.onAuthStateChanged(refreshMe);
  loadContent(); loadReflections();
})();
