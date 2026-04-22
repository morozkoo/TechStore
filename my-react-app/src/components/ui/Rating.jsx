function Rating({ value }) {
  const fullStars = Math.floor(value);
  const hasHalfStar = value % 1 !== 0;

  return (
    <div className="rating">
      {'★'.repeat(fullStars)}
      {hasHalfStar && '½'}
      {'☆'.repeat(5 - Math.ceil(value))}
      <span> ({value})</span>
    </div>
  );
}

export default Rating;
