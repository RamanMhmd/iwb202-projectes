$(function () {
  function getApps() {
    const raw = localStorage.getItem('apps_v1');
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null }
  }

  function saveApps(arr) {
    localStorage.setItem('apps_v1', JSON.stringify(arr));
  }

  function seedDefaultApps() {
    const defaults = [
      {
        appName: "StudyMate",
        developer: "EduSoft",
        domain: "Education",
        isFree: "Yes",
        description: "A lightweight study planner and flashcards app.",
        logoUrl: "https://via.placeholder.com/120x80.png?text=StudyMate",
        mediaUrl: ""
      },
      {
        appName: "ShopEase",
        developer: "CommerceX",
        domain: "E-Commerce",
        isFree: "No",
        description: "Simple store builder for small sellers.",
        logoUrl: "https://via.placeholder.com/120x80.png?text=ShopEase",
        mediaUrl: ""
      },
      {
        appName: "RoboGuide",
        developer: "MechLab",
        domain: "Robotics",
        isFree: "Yes",
        description: "Simulation tools for beginner robotics projects.",
        logoUrl: "https://via.placeholder.com/120x80.png?text=RoboGuide",
        mediaUrl: ""
      },
      {
        appName: "FocusPro",
        developer: "FlowApps",
        domain: "Productivity",
        isFree: "No",
        description: "Pomodoro based focus and analytics.",
        logoUrl: "https://via.placeholder.com/120x80.png?text=FocusPro",
        mediaUrl: ""
      },
      {
        appName: "StreamFun",
        developer: "MediaCorp",
        domain: "Entertainment",
        isFree: "Yes",
        description: "Mini platform for short user generated clips.",
        logoUrl: "https://via.placeholder.com/120x80.png?text=StreamFun",
        mediaUrl: ""
      }
    ];
    saveApps(defaults);
    return defaults;
  }

  function ensureAppsSeed() {
    let apps = getApps();
    if (!apps || !apps.length) apps = seedDefaultApps();
    return apps;
  }

  if ($('body').is('[data-app-init]') === false) {
    $('body').attr('data-app-init', '1');
  }

  // $('#exitBtn').on('click', function (e) { e.preventDefault(); window.open('about:blank', '_self'); window.close(); });

  if (window.location.pathname.endsWith('/apps.html') || window.location.pathname.endsWith('apps.html')) {
    const apps = ensureAppsSeed();
    const $tbody = $('#appsTable tbody');
    $tbody.empty();
    const tpl = document.getElementById('rowTemplate').content;
    apps.forEach((app, idx) => {
      const clone = document.importNode(tpl, true);
      const tr = $(clone).find('tr.appRow');
      tr.find('.appName').text(app.appName);
      tr.find('.appDev').text(app.developer);
      tr.find('.appDomain').text(app.domain);
      tr.find('.appFree').text(app.isFree);
      const detailsRow = $(clone).find('tr.detailsRow');
      const logo = detailsRow.find('img.logo');
      logo.attr('src', app.logoUrl || 'https://via.placeholder.com/120x80.png?text=No+Logo');
      detailsRow.find('.desc').text(app.description || '');
      detailsRow.find('.website').attr('href', app.website || '#').text(app.website || '');
      const mediaContainer = detailsRow.find('.mediaContainer');
      mediaContainer.empty();
      if (app.mediaUrl) {
        const low = app.mediaUrl.toLowerCase();
        if (low.endsWith('.mp4') || low.endsWith('.webm') || low.endsWith('.ogg')) {
          const v = $('<video controls></video>');
          v.attr('src', app.mediaUrl);
          mediaContainer.append(v);
        } else if (low.endsWith('.mp3') || low.endsWith('.wav') || low.endsWith('.ogg')) {
          const a = $('<audio controls></audio>');
          a.attr('src', app.mediaUrl);
          mediaContainer.append(a);
        } else {
          const link = $('<a target="_blank" rel="noopener">Open media</a>');
          link.attr('href', app.mediaUrl);
          mediaContainer.append(link);
        }
      }
      $tbody.append(clone);
    });

    $tbody.on('click', '.detailsBtn', function () {
      const btn = $(this);
      const row = btn.closest('tr.appRow');
      const details = row.next('tr.detailsRow');
      details.toggle();
      btn.text(details.is(':visible') ? 'Hide details' : 'Show details');
    });

    $('#clearAll').on('click', function () {
      if (confirm('Clear all apps?')) { localStorage.removeItem('apps_v1'); location.reload(); }
    });
  }

  if (window.location.pathname.endsWith('/add_app.html') || window.location.pathname.endsWith('add_app.html')) {
    $('#appForm').on('submit', function (e) {
      e.preventDefault();
      const appName = $('#appName').val().trim();
      const developer = $('#developer').val().trim();
      const website = $('#website').val().trim();
      const isFree = $('input[name=isFree]:checked').val();
      const domain = $('#domain').val();
      const description = $('#description').val().trim();
      const logoUrl = $('#logoUrl').val().trim();
      const mediaUrl = $('#mediaUrl').val().trim();

      const nameRe = /^[A-Za-z]+$/;
      const devRe = /^[A-Za-z]+$/;
      const urlRe = /^(https?:\/\/)[^\s$.?#].[^\s]*$/i;

      if (!nameRe.test(appName)) { $('#formMsg').text('Application name must be English letters only with no spaces.'); return; }
      if (!devRe.test(developer)) { $('#formMsg').text('Developer company must be English letters only.'); return; }
      if (!urlRe.test(website)) { $('#formMsg').text('Website must be a valid URL starting with http(s)://.'); return; }
      if (!domain) { $('#formMsg').text('Choose a usage domain.'); return; }
      if (!description) { $('#formMsg').text('Provide a short description.'); return; }

      let apps = getApps();
      if (!apps) apps = [];
      apps.push({ appName, developer, website, isFree, domain, description, logoUrl, mediaUrl });
      saveApps(apps);
      window.location.href = 'apps.html';
    });

    $('#appForm').on('reset', function () {
      $('#formMsg').text('');
    });
  }

  if (window.location.pathname.endsWith('/home.html') || window.location.pathname.endsWith('home.html') || window.location.pathname === '/') {
    const notesKey = 'team_notes_v1';
    const $notes = $('#teamNotes');
    const saved = localStorage.getItem(notesKey);
    if (saved) $notes.val(saved);
    $('#saveNotes').on('click', function () { localStorage.setItem(notesKey, $notes.val() || ''); alert('Notes saved'); });
    $('#clearNotes').on('click', function () { $notes.val(''); localStorage.removeItem(notesKey); });
    $('#publishLink a').on('click', function () { });
  }
});
