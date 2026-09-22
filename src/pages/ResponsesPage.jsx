import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Pagination } from '../components/Pagination';
import { MessageSquareText, Search, Calendar, User, Mail, Trash2, Star, Filter, RotateCcw, Check } from 'lucide-react';

export const ResponsesPage = () => {
  const { formResponses, formQuestions, isAdmin, clearFormResponses, refreshFormResponses, heroConfig } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showHiddenFields, setShowHiddenFields] = useState(false);
  const [refreshMsg, setRefreshMsg] = useState('');

  const handleRefresh = async () => {
    const res = await refreshFormResponses();
    if (res.success) {
      setRefreshMsg(`✅ 已刷新（共 ${res.count} 則紀錄）`);
      setTimeout(() => setRefreshMsg(''), 3000);
    }
  };

  // 判斷哪些題目需要在回應中顯示
  const visibleQuestions = formQuestions.filter(q => showHiddenFields || !q.hideInResponses);
  const hiddenCount = formQuestions.filter(q => q.hideInResponses).length;

  // 根據搜尋關鍵字過濾回應
  const filteredResponses = formResponses.filter(resp => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    
    // 檢查答案內容或時間
    const dateMatch = resp.submittedAt?.toLowerCase().includes(term);
    const answersMatch = Object.values(resp.answers || {}).some(val => 
      String(val).toLowerCase().includes(term)
    );
    return dateMatch || answersMatch;
  });

  // 計算分頁 (1, 2, 3...)
  const totalPages = Math.ceil(filteredResponses.length / itemsPerPage) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const currentResponses = filteredResponses.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newSize) => {
    setItemsPerPage(newSize);
    setCurrentPage(1);
  };

  return (
    <div className="animate-fade-in">
      {/* 標題與搜尋 bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2rem' }}>
        <div>
          <div className="badge badge-emerald" style={{ marginBottom: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <MessageSquareText size={12} /> {heroConfig?.responsesPageBadge || '大家的回應與反饋'}
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: '800' }}>
            {heroConfig?.responsesPageTitle || '表單回應數據記錄'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.3rem' }}>
            {heroConfig?.responsesPageSubtitle || '查看訪客所提交的完整問卷資料。下方提供 1, 2, 3... 頁碼分頁切換與搜尋功能。'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <button className="btn btn-primary btn-sm" onClick={handleRefresh} style={{ boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)' }}>
            <RotateCcw size={15} /> 重新整理 / 刷新最新紀錄
          </button>

          {hiddenCount > 0 && (
            <button 
              className={`btn btn-sm ${showHiddenFields ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setShowHiddenFields(!showHiddenFields)}
              title="後台設定隱藏的題目"
            >
              <Filter size={14} /> {showHiddenFields ? '隱藏未顯示題目' : `顯示已隱藏題目 (${hiddenCount})`}
            </button>
          )}

          {isAdmin && formResponses.length > 0 && (
            <button className="btn btn-danger btn-sm" onClick={() => {
              if (window.confirm('確定要清空所有表單回應數據嗎？此操作不可逆。')) {
                clearFormResponses();
              }
            }}>
              <Trash2 size={16} /> 清空所有回應
            </button>
          )}
        </div>
      </div>

      {refreshMsg && (
        <div style={{
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(16, 185, 129, 0.2)',
          border: '1.5px solid var(--accent-emerald)',
          color: '#fff',
          fontWeight: '700',
          fontSize: '0.92rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          boxShadow: '0 4px 20px rgba(16, 185, 129, 0.2)'
        }}>
          <Check size={18} color="var(--accent-emerald)" /> {refreshMsg}
        </div>
      )}

      {/* 搜尋過濾 Bar */}
      <div className="glass-panel" style={{ padding: '1rem 1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Search size={20} color="var(--text-muted)" />
        <input
          type="text"
          className="form-control"
          placeholder="搜尋稱呼、Email 或答案關鍵字..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          style={{ background: 'transparent', border: 'none', padding: '0.4rem 0' }}
        />
        {searchTerm && (
          <button 
            className="btn btn-sm btn-secondary" 
            onClick={() => setSearchTerm('')}
            style={{ whiteSpace: 'nowrap' }}
          >
            清除搜尋
          </button>
        )}
      </div>

      {/* 回應內容列表 */}
      {filteredResponses.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <MessageSquareText size={48} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-title)', marginBottom: '0.5rem' }}>
            {searchTerm ? '找不到符合關鍵字的回應內容' : '目前尚無表單回應紀錄'}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {searchTerm ? '請嘗試更換搜尋關鍵字。' : '訪客填寫表單送出後，資料將自動寫入本地庫並顯示於此。'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {currentResponses.map((resp, idx) => (
            <div key={resp.id} className="glass-panel glass-panel-interactive" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-glass)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className="badge badge-indigo">
                    #{startIndex + idx + 1} 號回應
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Calendar size={14} />
                    {resp.submittedAt}
                  </span>
                </div>
              </div>

              {/* 回應答案渲染 (相容所有已知題目與額外未對應欄位) */}
              {(() => {
                const answeredQuestionIds = new Set(formQuestions.map(q => q.id));
                const answersObj = resp.answers || {};
                const entries = Object.entries(answersObj);
                const hasAnyAnswer = entries.some(([_, val]) => val !== undefined && val !== '');

                if (!hasAnyAnswer) {
                  return (
                    <div style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.88rem', fontStyle: 'italic' }}>
                      (本筆提交紀錄尚未包含詳細內容)
                    </div>
                  );
                }

                return (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                    {/* 1. 符合目前題目的答案 */}
                    {visibleQuestions.map(q => {
                      const val = answersObj[q.id];
                      if (val === undefined || val === '') return null;

                      return (
                        <div key={q.id} className="event-inner-box" style={{ padding: '0.9rem 1.1rem', borderRadius: 'var(--radius-md)', border: q.hideInResponses ? '1px dashed var(--accent-pink)' : undefined }}>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span>{q.title}</span>
                            {q.hideInResponses && <span style={{ fontSize: '0.7rem', color: 'var(--accent-pink)' }}>[後台設為隱藏]</span>}
                          </div>
                          
                          {q.type === 'rating' ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#d97706', fontWeight: '700' }}>
                              <Star size={16} fill="#f59e0b" color="#f59e0b" />
                              <span>{val} 星評分</span>
                            </div>
                          ) : (
                            <div style={{ fontSize: '0.95rem', color: 'var(--text-main)', wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                              {String(val)}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* 2. 額外未對應題目的舊答案與純鍵值內容 */}
                    {entries.map(([key, val]) => {
                      if (answeredQuestionIds.has(key) || val === undefined || val === '') return null;
                      return (
                        <div key={key} className="event-inner-box" style={{ padding: '0.9rem 1.1rem', borderRadius: 'var(--radius-md)', border: '1px dashed var(--accent-indigo)' }}>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: '600' }}>
                            欄位: {key}
                          </div>
                          <div style={{ fontSize: '0.95rem', color: 'var(--text-main)', wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                            {String(val)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          ))}
        </div>
      )}

      {/* 頁碼 1, 2, 3... 分頁控制元件 (Requirement 2) */}
      <Pagination
        currentPage={safeCurrentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={handleItemsPerPageChange}
        totalItems={filteredResponses.length}
      />
    </div>
  );
};
