import { ArrowLongRightIcon } from '@heroicons/react/24/outline'
import { FC, ReactNode } from 'react'

type Props = {
  children?: ReactNode
  onClick?: () => void
}

export const ArrowButton: FC<Props> = ({ children, ...rest }) => (
  <button
    {...rest}
    className='rounded-full bg-grayDarker px-5 py-3 text-xs font-light leading-normal text-white'
  >
    <div className='flex items-center gap-x-5'>
      {children}
      <ArrowLongRightIcon stroke='#DE67E4' className='size-6' />
    </div>
  </button>
)
