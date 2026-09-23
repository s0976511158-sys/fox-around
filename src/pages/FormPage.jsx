import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FileText, Sparkles, Send, CheckCircle2, Gift, Calendar, MapPin, ArrowRight, Clock, Lock } from 'lucide-react';

export const FormPage = ({ embedded = false }) => {
  const { eventInfo, formQuestions, addFormResponse, setActiveTab, heroConfig } = useApp();
  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [focusedQId, setFocusedQId] = useState(null);

  // 動態判定活動與問卷是否已截止 (支援手動設定與時間自動比對)
  const now = new Date();
  const isTimeExpired = (eventInfo?.endDate && !isNaN(Date.parse(eventInfo.endDate)) && now > new Date(eventInfo.endDate)) ||
                        (eventInfo?.deadlineText && !isNaN(Date.parse(eventInfo.deadlineText)) && now > new Date(eventInfo.deadlineText));
  const isExpired = Boolean(eventInfo?.isExpired || isTimeExpired);

  // 處理表單欄位輸入變更
  const handleInputChange = (qId, value) => {
    setFormData(prev => ({
      ...prev,
      [qId]: value
    }));
    if (errorMsg) setErrorMsg('');
  };

  // 表單提交處理
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isExpired) return;
    
    // 必填欄位檢查 (僅定位並跳轉移動至沒填到的問題區域)
    for (const q of formQuestions) {
      if (q.required && (!formData[q.id] || String(formData[q.id]).trim() === '')) {
        setErrorMsg(`請完成必填項目：「${q.title}」`);
        
        setTimeout(() => {
          const el = document.getElementById(`q-container-${q.id}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.style.outline = '2px solid var(--accent-pink)';
            el.style.boxShadow = '0 0 25px rgba(236, 72, 153, 0.5)';
            setTimeout(() => {
              el.style.outline = 'none';
              el.style.boxShadow = 'none';
            }, 2500);
          } else {
            window.scrollTo({ top: 200, behavior: 'smooth' });
          }
        }, 50);
        return;
      }
    }

    // 儲存回應資料
    addFormResponse(formData);
    setSubmitted(true);
    setFormData({});
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '840px', margin: '0 auto' }}>
      
      {/* 標題區域 */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div className={`badge ${isExpired ? 'badge-pink' : 'badge-indigo'}`} style={{ marginBottom: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          {isExpired ? <Lock size={12} /> : <FileText size={12} />} 
          {isExpired ? '🔒 活動與問卷已截止' : (heroConfig?.formPageBadge || '官方活動意見與問卷調查')}
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: '800' }}>
          {heroConfig?.formPageTitle || '參與線上問卷調查'}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.5rem' }}>
          {heroConfig?.formPageSubtitle || '請參考上方活動目的說明並填寫以下問卷，您的建議將幫助我們持續優化體驗。'}
        </p>
      </div>

      {/* 活動簡介與填表目的說明卡片 (含時間實現限制說明) */}
      <div className="event-info-card">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
            <Sparkles size={20} style={{ flexShrink: 0 }} />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <h3 style={{ fontSize: 'clamp(1.1rem, 3.8vw, 1.35rem)', color: 'var(--text-title)', fontWeight: '800', lineHeight: '1.45', wordBreak: 'break-word', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {eventInfo.title}
            </h3>
            <div style={{ display: 'flex', gap: '0.4rem 1rem', color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.35rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', whiteSpace: 'nowrap' }}>
                <Calendar size={14} color="var(--accent-cyan)" style={{ flexShrink: 0 }} /> {eventInfo.dateText || `${eventInfo.startDate || ''} 至 ${eventInfo.endDate || ''}`}
              </span>
              {(eventInfo.deadlineText || eventInfo.endDate) && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: isExpired ? '#fca5a5' : 'var(--accent-pink)', fontWeight: '700', flexWrap: 'wrap' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', whiteSpace: 'nowrap' }}>
                    <Clock size={14} style={{ flexShrink: 0 }} /> 截止時間：{eventInfo.deadlineText || eventInfo.endDate}
                  </span>
                  <span className={`badge ${isExpired ? 'badge-pink' : 'badge-emerald'}`} style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)', whiteSpace: 'nowrap', display: 'inline-block' }}>
                    {isExpired ? '已截止' : '進行中'}
                  </span>
                </span>
              )}
              {eventInfo.location && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', whiteSpace: 'nowrap' }}>
                  <MapPin size={14} color="var(--accent-pink)" style={{ flexShrink: 0 }} /> {eventInfo.location}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 填表目的核心說明區塊 (支援 Enter 自由換行) */}
        <div className="event-inner-box" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
          <h4 style={{ fontSize: '0.95rem', color: 'var(--accent-cyan)', marginBottom: '0.5rem', fontWeight: '700' }}>
            {eventInfo.purposeTitle || '🎯 活動背景與填表目的說明'}
          </h4>
          <p className="event-purpose-text" style={{ fontSize: '0.93rem', lineHeight: '1.75', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {eventInfo.purpose}
          </p>
          {eventInfo.description && (
            <p className="event-desc-text" style={{ fontSize: '0.88rem', marginTop: '0.75rem', lineHeight: '1.65', whiteSpace: 'pre-wrap', wordBreak: 'break-word', borderTop: '1px dashed var(--border-glass)', paddingTop: '0.75rem' }}>
              {eventInfo.description}
            </p>
          )}
        </div>

        {/* 完成獎勵提示 */}
        {eventInfo.rewardText && (
          <div className="reward-text-box" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', fontWeight: '600' }}>
            <Gift size={18} color="#f59e0b" />
            <span>{eventInfo.rewardText}</span>
          </div>
        )}
      </div>

      {/* 若活動已截止，顯示已截止提示字元面板 (使用者需求) */}
      {isExpired ? (
        <div className="glass-panel animate-fade-in" style={{ padding: '3rem 2rem', textAlign: 'center', border: '2px solid rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.05)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto', boxShadow: '0 0 25px rgba(239, 68, 68, 0.2)' }}>
            <Lock size={32} />
          </div>
          <span className="badge badge-pink" style={{ marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem' }}>
            🔒 活動與問卷已截止招募
          </span>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: 'var(--text-title)', fontWeight: '800' }}>
            {eventInfo.expiredNotice || '⚠️ 本次活動問卷填寫已正式截止！'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.96rem', marginBottom: '2rem', maxWidth: '560px', margin: '0 auto 2rem auto', lineHeight: '1.7' }}>
            感謝廣大訪客熱情參與！本次「{eventInfo.title}」活動與問卷調查已截止。您可以點擊下方按鈕前往觀看歷年問卷回應數據或最新公告消息。
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => setActiveTab('responses')}>
              前往查看問卷回應紀錄 (分頁觀看)
              <ArrowRight size={18} />
            </button>
            <button className="btn btn-secondary" onClick={() => setActiveTab('announcements')}>
              觀看最新公告消息
            </button>
          </div>
        </div>
      ) : submitted ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
            <CheckCircle2 size={36} />
          </div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '0.75rem', color: 'var(--text-title)' }}>
            感謝您的熱心填寫與反饋！
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem auto' }}>
            您的寶貴意見已成功寫入系統資料庫。您可以前往「回應表單」頁面觀看所有參與者的回應內容。
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => setActiveTab('responses')}>
              前往查看回應表單 (分頁觀看)
              <ArrowRight size={18} />
            </button>
            <button className="btn btn-secondary" onClick={() => setSubmitted(false)}>
              繼續填寫一份
            </button>
          </div>
        </div>
      ) : (
        /* 問卷表單內容 */
        <form onSubmit={handleSubmit} className="glass-panel form-card-padding">
          {errorMsg && (
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#fca5a5', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.75rem', fontSize: '0.92rem' }}>
              ⚠️ {errorMsg}
            </div>
          )}

          {formQuestions.map((q, idx) => (
            <div key={q.id} id={`q-container-${q.id}`} className="form-group" style={{ transition: 'all 0.3s ease', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
              <label className="form-label">
                <span style={{ color: 'var(--accent-primary)', fontWeight: '700', marginRight: '6px' }}>
                  Q{idx + 1}.
                </span>
                {q.title}
                {q.required && <span style={{ color: 'var(--accent-pink)', marginLeft: '4px' }}>*</span>}
              </label>

              {/* 短單行文字 / Email */}
              {(q.type === 'text' || q.type === 'email') && (
                <input
                  type={q.type}
                  className="form-control"
                  placeholder={q.placeholder || '請輸入內容...'}
                  value={formData[q.id] || ''}
                  onChange={(e) => handleInputChange(q.id, e.target.value)}
                />
              )}

              {/* 多行文字 */}
              {q.type === 'textarea' && (
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder={q.placeholder || '請輸入詳細內容...'}
                  value={formData[q.id] || ''}
                  onChange={(e) => handleInputChange(q.id, e.target.value)}
                />
              )}

              {/* 單選題 Radio */}
              {q.type === 'radio' && q.options && (
                <div className="radio-group">
                  {q.options.map((opt, oIdx) => (
                    <label key={oIdx} className="option-label">
                      <input
                        type="radio"
                        name={q.id}
                        value={opt}
                        checked={formData[q.id] === opt}
                        onChange={() => handleInputChange(q.id, opt)}
                        style={{ accentColor: 'var(--accent-primary)', width: '18px', height: '18px', flexShrink: 0 }}
                      />
                      <span style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* 評分題 Rating (1~5 Stars) */}
              {q.type === 'rating' && (
                <div style={{ marginTop: '0.5rem' }}>
                  <div className="rating-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        className={`star-btn ${(formData[q.id] || 0) >= star ? 'active' : ''}`}
                        onClick={() => handleInputChange(q.id, star)}
                        aria-label={`${star} 星評分`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.4rem', display: 'block' }}>
                    {formData[q.id] ? `您評分了：${formData[q.id]} 顆星` : '請點擊星號評分'}
                  </span>
                </div>
              )}
            </div>
          ))}

          <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-glass)' }}>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.9rem', fontSize: '1.05rem' }}>
              <Send size={18} />
              {heroConfig?.formSubmitBtnText || '送出問卷表單內容'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
