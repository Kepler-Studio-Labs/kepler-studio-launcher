'use client'
import { useEffect } from 'react'
import { motion, stagger, useAnimate } from 'motion/react'
import PropTypes from 'prop-types'
import { cn } from '../../renderer-libs/utils'

export const TextGenerateEffect = ({ words, className, filter = true, duration = 0.5 }) => {
  const [scope, animate] = useAnimate()
  let wordsArray = words.split(' ')
  useEffect(() => {
    animate(
      'span',
      {
        opacity: 1,
        filter: filter ? 'blur(0px)' : 'none'
      },
      {
        duration: duration ? duration : 1,
        delay: stagger(0.05)
      }
    )
  }, [scope.current])

  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={word + idx}
              className="inline w-1/2 text-sm text-neutral-400 font-normal"
              style={{
                filter: filter ? 'blur(10px)' : 'none'
              }}
            >
              {word}{' '}
            </motion.span>
          )
        })}
      </motion.div>
    )
  }

  return (
    <div className={cn('font-bold', className)}>
      <div className="mt-4">
        <div className=" dark:text-white text-black text-2xl leading-snug tracking-wide">
          {renderWords()}
        </div>
      </div>
    </div>
  )
}

TextGenerateEffect.propTypes = {
  words: PropTypes.string.isRequired,
  className: PropTypes.string,
  filter: PropTypes.bool,
  duration: PropTypes.number
}
