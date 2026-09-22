import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalItems
}) => {
  if (totalPages <= 1) {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
        <span>共 {totalItems} 筆回應資料</span>
        {onItemsPerPageChange && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>每頁顯示：</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="form-control"
              style={{ padding: '0.2rem 0.6rem', fontSize: '0.85rem', width: 'auto' }}
            >
              <option value={3}>3 筆</option>
              <option value={5}>5 筆</option>
              <option value={10}>10 筆</option>
            </select>
          </div>
        )}
      </div>
    );
  }

  // 產生頁碼陣列 [1, 2, 3...]
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination-container">
      <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        顯示第 <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> 至 <strong>{Math.min(currentPage * itemsPerPage, totalItems)}</strong> 筆，共 <strong>{totalItems}</strong> 筆
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* 每頁數量選擇 */}
        {onItemsPerPageChange && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <span>每頁顯示：</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="form-control"
              style={{ padding: '0.25rem 0.6rem', fontSize: '0.85rem', width: 'auto' }}
            >
              <option value={3}>3 筆</option>
              <option value={5}>5 筆</option>
              <option value={10}>10 筆</option>
            </select>
          </div>
        )}

        {/* 頁碼 1, 2, 3... 按鈕列表 */}
        <div className="pagination-pages">
          <button
            className="page-number-btn"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{ opacity: currentPage === 1 ? 0.4 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
            aria-label="上一頁"
          >
            <ChevronLeft size={18} />
          </button>

          {pages.map((p) => (
            <button
              key={p}
              className={`page-number-btn ${currentPage === p ? 'active' : ''}`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          ))}

          <button
            className="page-number-btn"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{ opacity: currentPage === totalPages ? 0.4 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
            aria-label="下一頁"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
