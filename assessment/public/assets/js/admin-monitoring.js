(function () {
  let timerId = null;
  let countdownTimerId = null;
  let activeSessionsData = [];

  const els = {
    btnRefresh: document.getElementById('btnRefresh'),
    refreshSvg: document.getElementById('refreshSvg'),
    selInterval: document.getElementById('selInterval'),
    lastUpdatedTime: document.getElementById('lastUpdatedTime'),
    btnLogout: document.getElementById('btnLogout'),
    userRoleTag: document.getElementById('userRoleTag'),

    // Server
    cpuValue: document.getElementById('cpuValue'),
    cpuSub: document.getElementById('cpuSub'),
    cpuBar: document.getElementById('cpuBar'),

    ramValue: document.getElementById('ramValue'),
    ramSub: document.getElementById('ramSub'),
    ramBar: document.getElementById('ramBar'),

    diskValue: document.getElementById('diskValue'),
    diskSub: document.getElementById('diskSub'),
    diskBar: document.getElementById('diskBar'),

    dbSizeValue: document.getElementById('dbSizeValue'),
    dbSub: document.getElementById('dbSub'),
    envPhp: document.getElementById('envPhp'),
    envUptime: document.getElementById('envUptime'),

    // KPIs
    usersTotal: document.getElementById('usersTotal'),
    usersSub: document.getElementById('usersSub'),
    users24hBadge: document.getElementById('users24hBadge'),
    usersActiveDetail: document.getElementById('usersActiveDetail'),

    orgsTotal: document.getElementById('orgsTotal'),
    orgsApprovedDetail: document.getElementById('orgsApprovedDetail'),
    orgsPendingDetail: document.getElementById('orgsPendingDetail'),

    attemptsPassed: document.getElementById('attemptsPassed'),
    attemptsRate: document.getElementById('attemptsRate'),
    attemptsTotal: document.getElementById('attemptsTotal'),

    liveCountValue: document.getElementById('liveCountValue'),
    liveCountSub: document.getElementById('liveCountSub'),
    liveBadgeCount: document.getElementById('liveBadgeCount'),

    // Live container
    liveSessionsContainer: document.getElementById('liveSessionsContainer'),

    // Daily
    dailyBarsChart: document.getElementById('dailyBarsChart'),
    dailyTableBody: document.getElementById('dailyTableBody'),

    // Extra
    campaignsStatsList: document.getElementById('campaignsStatsList'),
    topRegionsList: document.getElementById('topRegionsList'),
    queueModBadge: document.getElementById('queueModBadge'),
    queueRetakeBadge: document.getElementById('queueRetakeBadge'),
    queueMailBadge: document.getElementById('queueMailBadge'),

    // REG.RU & Server Section
    regruWrapper: document.getElementById('regruBalanceWrapper'),
    regruCard: document.getElementById('regruBalanceCard'),
    regruBalanceVal: document.getElementById('regruBalanceVal'),
    regruBalancePill: document.getElementById('regruBalancePill'),
    regruBalanceWarning: document.getElementById('regruBalanceWarning'),
    regruWarningText: document.getElementById('regruWarningText'),
    regruTopupBtn: document.getElementById('regruTopupBtn'),
    sectionServerResources: document.getElementById('sectionServerResources'),
  };

  function esc(s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatBytes(bytes, decimals = 1) {
    if (!bytes || bytes <= 0) return '0 Б';
    const k = 1024;
    const sizes = ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
  }

  function formatDuration(sec) {
    sec = Math.max(0, Math.floor(sec || 0));
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m} мин ${s} сек`;
  }

  function formatCountdown(sec) {
    sec = Math.max(0, Math.floor(sec || 0));
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function formatUptime(sec) {
    if (!sec || sec <= 0) return 'Аптайм: —';
    const days = Math.floor(sec / 86400);
    const hours = Math.floor((sec % 86400) / 3600);
    if (days > 0) return `Аптайм: ${days} дн. ${hours} ч.`;
    return `Аптайм: ${hours} ч.`;
  }

  function getBarColorClass(percent) {
    if (percent >= 85) return 'mon-bar__fill--red';
    if (percent >= 65) return 'mon-bar__fill--amber';
    return 'mon-bar__fill--green';
  }

  async function loadMonitoringData(forceRegru = false) {
    if (els.refreshSvg) els.refreshSvg.classList.add('is-spinning');

    try {
      const url = forceRegru ? 'api/admin-monitoring.php?refresh_regru=1' : 'api/admin-monitoring.php';
      const res = await AsmtApi.get(url);
      if (!res.success) {
        if (res.error === 'Unauthorized' || res.status === 401 || (typeof res.error === 'string' && res.error.toLowerCase().includes('auth'))) {
          location.href = 'login.html';
          return;
        }
        console.error('Monitoring API error:', res.error);
        return;
      }

      renderRegRu(res.regru);
      renderServer(res.server);
      renderKPIs(res.kpis);
      renderLive(res.live);
      renderDaily(res.dailyTrends);
      renderExtra(res.extra, res.kpis.queues);

      if (els.lastUpdatedTime) {
        const d = new Date();
        els.lastUpdatedTime.textContent = d.toLocaleTimeString();
      }
    } catch (err) {
      if (err && (err.status === 401 || String(err).includes('Unauthorized'))) {
        location.href = 'login.html';
        return;
      }
      console.error('Failed to load monitoring data:', err);
    } finally {
      if (els.refreshSvg) {
        setTimeout(() => els.refreshSvg.classList.remove('is-spinning'), 300);
      }
    }
  }

  function renderRegRu(reg) {
    if (!els.regruCard) return;

    if (!reg) {
      if (els.regruWrapper) els.regruWrapper.style.display = 'none';
      return;
    }
    if (els.regruWrapper) els.regruWrapper.style.display = 'flex';

    // Если не настроен в .env
    if (!reg.configured) {
      els.regruCard.className = 'mon-regru-card';
      if (els.regruBalanceVal) {
        els.regruBalanceVal.textContent = 'Не настроен';
        els.regruBalanceVal.style.fontSize = '1.15rem';
        els.regruBalanceVal.style.color = 'var(--muted)';
      }
      if (els.regruBalancePill) {
        els.regruBalancePill.textContent = 'Требуется .env';
        els.regruBalancePill.style.background = '#f1f5f9';
        els.regruBalancePill.style.color = '#64748b';
      }
      if (els.regruWarningText) {
        els.regruWarningText.textContent = 'Для отображения баланса укажите ASMT_REGRU_USERNAME и ASMT_REGRU_PASSWORD в файле .env';
        if (els.regruBalanceWarning) {
          els.regruBalanceWarning.style.display = 'flex';
          els.regruBalanceWarning.style.background = '#f8fafc';
          els.regruBalanceWarning.style.borderColor = '#e2e8f0';
          els.regruBalanceWarning.style.color = '#64748b';
        }
      }
      return;
    }

    // Ошибка от API REG.RU
    if (reg.error && reg.balance == null) {
      els.regruCard.className = 'mon-regru-card';
      if (els.regruBalanceVal) {
        els.regruBalanceVal.textContent = 'Ошибка API';
        els.regruBalanceVal.style.fontSize = '1.15rem';
        els.regruBalanceVal.style.color = '#b45309';
      }
      if (els.regruBalancePill) {
        els.regruBalancePill.textContent = 'Внимание';
        els.regruBalancePill.style.background = '#fef3c7';
        els.regruBalancePill.style.color = '#b45309';
      }
      if (els.regruWarningText) {
        els.regruWarningText.textContent = reg.error;
        if (els.regruBalanceWarning) {
          els.regruBalanceWarning.style.display = 'flex';
          els.regruBalanceWarning.style.background = '#fffbeb';
          els.regruBalanceWarning.style.borderColor = '#fde68a';
          els.regruBalanceWarning.style.color = '#92400e';
        }
      }
      return;
    }

    // Баланс успешно получен
    const bal = typeof reg.balance === 'number' ? reg.balance : parseFloat(reg.balance || 0);
    const formatted = bal.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₽';
    if (els.regruBalanceVal) {
      els.regruBalanceVal.textContent = formatted;
    }

    if (bal < 500) {
      // КРАСНЫМ И ЖИРНЫМ!
      els.regruCard.className = 'mon-regru-card mon-regru-card--critical';
      if (els.regruBalanceVal) {
        els.regruBalanceVal.style.fontSize = '';
        els.regruBalanceVal.style.color = '';
      }
      if (els.regruBalancePill) {
        els.regruBalancePill.textContent = 'КРИТИЧЕСКИЙ ОСТАТОК (< 500 ₽)';
        els.regruBalancePill.style.background = '';
        els.regruBalancePill.style.color = '';
      }
      if (els.regruWarningText) {
        els.regruWarningText.innerHTML = `<strong>ВНИМАНИЕ:</strong> На счёте REG.RU осталось <strong>${formatted}</strong> (менее 500 ₽)! Срочно пополните счёт хостинга во избежание блокировки услуг.`;
        if (els.regruBalanceWarning) {
          els.regruBalanceWarning.style.display = 'flex';
          els.regruBalanceWarning.style.background = '';
          els.regruBalanceWarning.style.borderColor = '';
          els.regruBalanceWarning.style.color = '';
        }
      }
    } else {
      // Баланс в норме
      els.regruCard.className = 'mon-regru-card mon-regru-card--ok';
      if (els.regruBalanceVal) {
        els.regruBalanceVal.style.fontSize = '';
        els.regruBalanceVal.style.color = '';
      }
      if (els.regruBalancePill) {
        els.regruBalancePill.textContent = `Счёт активен${reg.cached ? ' · кэш' : ''}`;
        els.regruBalancePill.style.background = '';
        els.regruBalancePill.style.color = '';
      }
      if (els.regruBalanceWarning) {
        els.regruBalanceWarning.style.display = 'none';
      }
    }
  }

  function renderServer(srv) {
    if (!srv) return;

    // CPU
    const cpu = srv.cpu || {};
    const cpuPct = cpu.percent || 0;
    if (els.cpuValue) els.cpuValue.textContent = `${cpuPct}%`;
    if (els.cpuSub) {
      els.cpuSub.textContent = `Ядер: ${cpu.cores || 1} · Нагрузка: ${cpu.load1 || 0} / ${cpu.load5 || 0}`;
    }
    if (els.cpuBar) {
      els.cpuBar.style.width = `${Math.min(100, Math.max(3, cpuPct))}%`;
      els.cpuBar.className = 'mon-bar__fill ' + getBarColorClass(cpuPct);
    }

    // RAM
    const ram = srv.ram || {};
    const ramPct = ram.percent || 0;
    if (els.ramValue) {
      els.ramValue.textContent = `${formatBytes(ram.usedBytes)} (${ramPct}%)`;
    }
    if (els.ramSub) {
      els.ramSub.textContent = `Всего: ${formatBytes(ram.totalBytes)} · PHP: ${formatBytes(ram.phpUsageBytes, 0)}`;
    }
    if (els.ramBar) {
      els.ramBar.style.width = `${Math.min(100, Math.max(3, ramPct))}%`;
      els.ramBar.className = 'mon-bar__fill ' + getBarColorClass(ramPct);
    }

    // DISK
    const disk = srv.disk || {};
    const diskPct = disk.percent || 0;
    if (els.diskValue) {
      els.diskValue.textContent = `${formatBytes(disk.usedBytes)} (${diskPct}%)`;
    }
    if (els.diskSub) {
      els.diskSub.textContent = `Свободно: ${formatBytes(disk.freeBytes)} из ${formatBytes(disk.totalBytes)}`;
    }
    if (els.diskBar) {
      els.diskBar.style.width = `${Math.min(100, Math.max(3, diskPct))}%`;
      els.diskBar.className = 'mon-bar__fill ' + getBarColorClass(diskPct);
    }

    // ENVIRONMENT / DB
    const env = srv.env || {};
    if (els.dbSizeValue) els.dbSizeValue.textContent = env.dbSize || '—';
    if (els.dbSub) {
      els.dbSub.textContent = `${env.dbVersion || 'PostgreSQL'} · Соединений: ${env.dbConnections || 0}`;
    }
    if (els.envPhp) els.envPhp.textContent = `PHP ${env.phpVersion || ''}`;
    if (els.envUptime) els.envUptime.textContent = formatUptime(env.uptimeSeconds);
  }

  function renderKPIs(kpis) {
    if (!kpis) return;

    // Users
    const u = kpis.users || {};
    if (els.usersTotal) els.usersTotal.textContent = (u.total || 0).toLocaleString();
    if (els.users24hBadge) els.users24hBadge.textContent = `+${u.new24h || 0} за 24ч`;
    if (els.usersActiveDetail) els.usersActiveDetail.textContent = `Активных: ${(u.active || 0).toLocaleString()}`;

    // Organizations
    const o = kpis.organizations || {};
    if (els.orgsTotal) els.orgsTotal.textContent = (o.total || 0).toLocaleString();
    if (els.orgsApprovedDetail) els.orgsApprovedDetail.textContent = `Подтверждено: ${(o.approved || 0).toLocaleString()}`;
    if (els.orgsPendingDetail) els.orgsPendingDetail.textContent = `В очереди: ${(o.pending || 0).toLocaleString()}`;

    // Attempts
    const a = kpis.attempts || {};
    if (els.attemptsPassed) els.attemptsPassed.textContent = (a.passed || 0).toLocaleString();
    if (els.attemptsRate) els.attemptsRate.textContent = `${a.passRate || 0}%`;
    if (els.attemptsTotal) els.attemptsTotal.textContent = (a.total || 0).toLocaleString();
  }

  function renderLive(live) {
    if (!live) return;
    const count = live.count || 0;
    activeSessionsData = live.sessions || [];

    if (els.liveCountValue) els.liveCountValue.textContent = String(count);
    if (els.liveBadgeCount) els.liveBadgeCount.textContent = `${count} онлайн`;
    if (els.liveCountSub) {
      els.liveCountSub.textContent = count === 1 ? '1 сессия тестирования' : `${count} сессий тестирования`;
    }

    if (!els.liveSessionsContainer) return;

    if (!activeSessionsData.length) {
      els.liveSessionsContainer.innerHTML = `
        <div style="text-align:center; padding:40px 20px; background:#f8fafc; border:1px dashed var(--border); border-radius:12px;">
          <div style="width:48px; height:48px; border-radius:50%; background:#ecfdf5; color:#059669; display:inline-flex; align-items:center; justify-content:center; margin-bottom:12px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <div style="font-size:1.05rem; font-weight:700; color:var(--text); margin-bottom:4px;">Активных тестирований сейчас нет</div>
          <div style="font-size:0.84rem; color:var(--muted);">Все запущенные ранее билеты завершены или время их прохождения истекло.</div>
        </div>
      `;
      return;
    }

    els.liveSessionsContainer.innerHTML = `
      <div style="overflow-x:auto;">
        <table class="mon-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Участник</th>
              <th>Организация и регион</th>
              <th>Кампания</th>
              <th>Начало</th>
              <th>Осталось времени</th>
              <th>Прогресс ответов</th>
              <th>Статус сети</th>
            </tr>
          </thead>
          <tbody>
            ${activeSessionsData.map((s) => {
              const ans = s.answeredCount || 0;
              const total = s.totalQuestions || 40;
              const pct = s.progressPercent || 0;
              const isDisconnected = s.disconnectCount > 0;
              const startTimeStr = s.startedAt ? s.startedAt.slice(11, 16) : '—';

              return `
                <tr>
                  <td><strong style="color:var(--muted); font-size:0.8rem;">#${s.attemptId}</strong></td>
                  <td>
                    <div style="font-weight:700; color:var(--text);">${esc(s.userName || 'Участник')}</div>
                    <div style="font-size:0.75rem; color:var(--muted);">${esc(s.email)} · ${esc(s.phone || '—')}</div>
                  </td>
                  <td>
                    <div style="font-weight:600; font-size:0.85rem;" title="${esc(s.orgName)}">${esc(s.orgName)}</div>
                    <div style="font-size:0.75rem; color:var(--muted);">${esc(s.regionName)}</div>
                  </td>
                  <td>
                    <span style="font-size:0.82rem; color:var(--text);">${esc(s.campaignName || 'Аттестация')}</span>
                  </td>
                  <td>
                    <span style="font-size:0.85rem; font-weight:600;">${startTimeStr}</span>
                  </td>
                  <td>
                    <span class="badge countdown-pill" data-session-id="${s.attemptId}" data-remaining="${s.remainingSeconds}" style="background:#eff6ff; color:#1d4ed8; font-weight:800; font-family:monospace; font-size:0.82rem; padding:4px 8px;">
                      ${formatCountdown(s.remainingSeconds)}
                    </span>
                  </td>
                  <td style="min-width:140px;">
                    <div style="display:flex; justify-content:space-between; font-size:0.78rem; font-weight:700; margin-bottom:4px;">
                      <span style="color:#059669;">${ans} из ${total}</span>
                      <span style="color:var(--muted);">${pct}%</span>
                    </div>
                    <div class="mon-bar" style="margin:0; height:6px;">
                      <div class="mon-bar__fill mon-bar__fill--green" style="width:${Math.max(2, pct)}%;"></div>
                    </div>
                  </td>
                  <td>
                    ${s.isOnline ? `
                      <span class="badge" style="background:#ecfdf5; color:#047857; font-size:0.72rem; font-weight:700;">В сети</span>
                    ` : `
                      <span class="badge" style="background:#fff1f2; color:#be123c; font-size:0.72rem; font-weight:700;">Связь потеряна</span>
                    `}
                    ${isDisconnected ? `<div style="font-size:0.68rem; color:#b45309; margin-top:2px;">Сбоев: ${s.disconnectCount}</div>` : ''}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // Ticking countdown timer for live sessions
  function tickCountdowns() {
    const pills = document.querySelectorAll('.countdown-pill[data-remaining]');
    pills.forEach((p) => {
      let rem = parseInt(p.getAttribute('data-remaining'), 10);
      if (rem > 0) {
        rem--;
        p.setAttribute('data-remaining', String(rem));
        p.textContent = formatCountdown(rem);
      } else {
        p.textContent = '00:00';
        p.style.background = '#fee2e2';
        p.style.color = '#b91c1c';
      }
    });
  }

  function renderDaily(dailyTrends) {
    if (!dailyTrends || !dailyTrends.length) {
      if (els.dailyBarsChart) {
        els.dailyBarsChart.innerHTML = '<div style="color:var(--muted); font-size:0.85rem; width:100%; text-align:center; padding:40px;">Данных за последние дни пока нет</div>';
      }
      if (els.dailyTableBody) {
        els.dailyTableBody.innerHTML = '<tr><td colspan="8" style="text-align:center; color:var(--muted); padding:20px;">Записи отсутствуют</td></tr>';
      }
      return;
    }

    // Chart
    if (els.dailyBarsChart) {
      const maxTotal = Math.max(1, ...dailyTrends.map((d) => d.total));
      const chartHeight = 160;

      els.dailyBarsChart.innerHTML = dailyTrends.map((d) => {
        const heightTotal = Math.round((d.total / maxTotal) * chartHeight);
        const passedPct = d.total > 0 ? (d.passed / d.total) : 0;
        const failedPct = d.total > 0 ? (d.failed / d.total) : 0;
        const heightPassed = Math.round(heightTotal * passedPct);
        const heightFailed = Math.max(0, heightTotal - heightPassed);
        const shortDate = d.date.slice(5); // "MM-DD"
        const passRate = d.total > 0 ? Math.round((d.passed / d.total) * 100) : 0;

        return `
          <div class="mon-bars-col">
            <div class="mon-tooltip">
              <div style="font-weight:700; margin-bottom:3px;">${esc(d.date)}</div>
              <div>Всего тестов: <strong>${d.total}</strong></div>
              <div style="color:#34d399;">Сдали успешно: ${d.passed} (${passRate}%)</div>
              <div style="color:#f87171;">Не сдали: ${d.failed}</div>
              <div>Средний балл: ${d.avgPercent}%</div>
              <div>Новых участников: +${d.newUsers}</div>
            </div>
            <div class="mon-bars-stack" style="height:${Math.max(6, heightTotal)}px;">
              ${heightPassed > 0 ? `<div class="mon-bar-segment mon-bar-segment--passed" style="height:${heightPassed}px;"></div>` : ''}
              ${heightFailed > 0 ? `<div class="mon-bar-segment mon-bar-segment--failed" style="height:${heightFailed}px;"></div>` : ''}
            </div>
            <div class="mon-bar-date">${shortDate}</div>
          </div>
        `;
      }).join('');
    }

    // Table
    if (els.dailyTableBody) {
      els.dailyTableBody.innerHTML = [...dailyTrends].reverse().map((d) => {
        const passRate = d.total > 0 ? Math.round((d.passed / d.total) * 100) : 0;
        return `
          <tr>
            <td><strong>${esc(d.date)}</strong></td>
            <td><strong style="color:var(--text);">${d.total}</strong></td>
            <td><span style="color:#059669; font-weight:700;">${d.passed}</span></td>
            <td><span style="color:#dc2626; font-weight:700;">${d.failed}</span></td>
            <td>
              <span class="badge" style="background:${passRate >= 70 ? '#ecfdf5' : '#fff1f2'}; color:${passRate >= 70 ? '#047857' : '#be123c'}; font-weight:700;">
                ${passRate}%
              </span>
            </td>
            <td>${d.avgPercent}%</td>
            <td>${formatDuration(d.avgDurationSec)}</td>
            <td><span class="badge" style="background:#eff6ff; color:#1d4ed8; font-weight:700;">+${d.newUsers}</span></td>
          </tr>
        `;
      }).join('');
    }
  }

  function renderExtra(extra, queues) {
    if (!extra) return;

    // Campaigns
    if (els.campaignsStatsList) {
      const camps = extra.campaigns || [];
      if (!camps.length) {
        els.campaignsStatsList.innerHTML = '<div style="color:var(--muted); font-size:0.85rem;">Кампании не созданы</div>';
      } else {
        els.campaignsStatsList.innerHTML = camps.map((c) => {
          return `
            <div style="background:#f8fafc; border:1px solid var(--border-light); border-radius:10px; padding:12px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                <strong style="font-size:0.88rem; color:var(--text);">${esc(c.name)}</strong>
                <span class="badge" style="background:#eff6ff; color:#1d4ed8; font-weight:700; font-size:0.75rem;">${c.total} попыток</span>
              </div>
              <div style="display:flex; justify-content:space-between; font-size:0.78rem; color:var(--muted);">
                <span>Сдали успешно: <strong style="color:#059669;">${c.passed}</strong></span>
                <span>Средний балл: <strong>${c.avgPercent}%</strong></span>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // Top Regions
    if (els.topRegionsList) {
      const regs = extra.topRegions || [];
      if (!regs.length) {
        els.topRegionsList.innerHTML = '<div style="color:var(--muted); font-size:0.85rem;">Данные по регионам отсутствуют</div>';
      } else {
        els.topRegionsList.innerHTML = regs.map((r) => {
          return `
            <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.84rem; padding:6px 0; border-bottom:1px solid var(--border-light);">
              <span style="font-weight:600; color:var(--text);">${esc(r.name)}</span>
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="color:var(--muted); font-size:0.78rem;">${r.users} уч. · ${r.attempts} тест.</span>
                <span class="badge" style="background:#ecfdf5; color:#047857; font-weight:700; font-size:0.72rem;">${r.avgPercent}% ср.</span>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // Queues
    if (queues) {
      if (els.queueModBadge) els.queueModBadge.textContent = String(queues.pendingModeration || 0);
      if (els.queueRetakeBadge) els.queueRetakeBadge.textContent = String(queues.pendingRetakes || 0);
      if (els.queueMailBadge) els.queueMailBadge.textContent = String(queues.mailSent24h || 0);
    }
  }

  function startAutoRefresh() {
    if (timerId) clearInterval(timerId);
    const intervalMs = parseInt(els.selInterval ? els.selInterval.value : '30000', 10);
    if (intervalMs > 0) {
      timerId = setInterval(loadMonitoringData, intervalMs);
    }
  }

  async function init() {
    try {
      const me = await AsmtApi.get('api/auth.php?action=me');
      if (!me.authenticated || !['superadmin', 'region_admin', 'moderator', 'analyst'].includes(me.user.role)) {
        location.href = 'login.html';
        return;
      }
      if (els.userRoleTag) {
        const roleLabels = {
          superadmin: 'Главный администратор',
          region_admin: 'Региональный администратор',
          moderator: 'Модератор',
          analyst: 'Аналитик',
        };
        els.userRoleTag.textContent = roleLabels[me.user.role] || me.user.role;
      }
    } catch (_e) {
      location.href = 'login.html';
      return;
    }

    if (els.btnRefresh) {
      els.btnRefresh.addEventListener('click', () => loadMonitoringData(true));
    }

    if (els.selInterval) {
      els.selInterval.addEventListener('change', startAutoRefresh);
    }

    if (els.btnLogout) {
      els.btnLogout.addEventListener('click', async () => {
        await AsmtApi.get('api/auth.php?action=logout');
        location.href = 'login.html';
      });
    }

    // Second-by-second countdown for live session timers
    countdownTimerId = setInterval(tickCountdowns, 1000);

    await loadMonitoringData();
    startAutoRefresh();
  }

  init();
})();
