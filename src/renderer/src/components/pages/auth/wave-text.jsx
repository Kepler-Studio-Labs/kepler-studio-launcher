const WaveText = ({ text, size = 'text-sm', amplitude = 5, speed = 0.18 }) => {
  const totalDuration = text.length * speed + speed // durée totale du cycle

  return (
    <div className={`flex space-x-1 overflow-hidden ${size}`}>
      {text.split('').map((char, index) => (
        <span
          key={index}
          className="wave"
          style={{
            animationDelay: `${index * speed}s`,
            animationDuration: `${totalDuration}s`,
            transform: 'translateY(0)'
          }}
        >
          {char}
        </span>
      ))}
      <style>{`
        .wave {
          display: inline-block;
          animation-name: wave;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        @keyframes wave {
          0%,
          ${((text.length * speed) / totalDuration) * 100}% {
            transform: translateY(0);
          }
          ${((text.length * speed + speed / 2) / totalDuration) * 100}% {
            transform: translateY(-${amplitude}px);
          }
        }
      `}</style>
    </div>
  )
}

export default WaveText
