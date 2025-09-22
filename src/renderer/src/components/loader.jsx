import { Loader2Icon } from 'lucide-react'
import { cn } from '../renderer-libs/utils'
import PropTypes from 'prop-types'

export const Loader = ({ className }) => (
  <Loader2Icon className={cn('w-4 h-4 animate-spin', className)} strokeWidth={3} />
)

Loader.propTypes = {
  className: PropTypes.string
}
