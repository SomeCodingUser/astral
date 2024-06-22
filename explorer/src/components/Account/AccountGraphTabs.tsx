import { TabTitle } from 'components/common/Tabs'
import React, { FC, ReactElement, useState } from 'react'
import { bigNumberToNumber, numberWithCommas } from 'utils/number'

type Props = {
  children: ReactElement[]
  total: string
  isDesktop?: boolean
}

export const AccountGraphTabs: FC<Props> = ({ children, total, isDesktop = false }) => {
  const [selectedTab, setSelectedTab] = useState(0)

  const tabStyle = isDesktop
    ? 'bg-white border border-slate-100 shadow rounded-[20px] p-4 dark:bg-gradient-to-r dark:from-gradientTwilight dark:via-gradientDusk dark:to-gradientSunset dark:border-none'
    : ''

  const tabTitleStyle = !isDesktop
    ? 'bg-white rounded-full mb-5 px-5 dark:bg-blueAccent dark:bg-gradient-to-r dark:from-gradientTwilight dark:via-gradientDusk dark:to-gradientSunset justify-center items-center'
    : ''

  const activePillStyle = 'dark:text-white text-white bg-grayDarker dark:bg-blueAccent'

  return (
    <div className={`flex w-full flex-wrap ${tabStyle}`}>
      <div className='w-full'>
        <div className='flex w-full flex-col md:items-center md:justify-between lg:flex-row'>
          <div className='hidden items-baseline gap-4 lg:flex'>
            <div className='text-[26px] font-medium text-gray-900 dark:text-white'>
              {total ? numberWithCommas(bigNumberToNumber(total)) : 0}
            </div>
            <div className='text-[13px] font-semibold text-gray-900 dark:text-white'>tSSC</div>
          </div>

          <div className='w-full lg:w-auto'>
            <ul
              className={`grid w-full list-none grid-cols-2 flex-row flex-wrap justify-items-center pb-4 pt-3 lg:flex ${tabTitleStyle}`}
              role='tablist'
            >
              {children.map((item, index) => (
                <TabTitle
                  key={index}
                  title={item.props.title}
                  onClick={item.props.onClick}
                  index={index}
                  isSelected={selectedTab === index}
                  setSelectedTab={setSelectedTab}
                  pillStyle='text-gray-600 bg-white dark:bg-transparent dark:text-white '
                  activePillStyle={activePillStyle}
                />
              ))}
            </ul>
          </div>
        </div>

        {children[selectedTab]}
      </div>
    </div>
  )
}
