import React from 'react';
export default function RatingStars({ value=0, onChange }){
  return (
    <div className="row">
      {[1,2,3,4,5].map(n => (
        <button key={n} className="ghost" onClick={()=>onChange?.(n)}>
          {n <= value ? '★' : '☆'}
        </button>
      ))}
    </div>
  );
}
