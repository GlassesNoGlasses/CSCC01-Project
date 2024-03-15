
import React, { useRef, useState } from 'react'
import { TabItem, TabProps } from './TabProps'

const Tab = ({
    items
}: TabProps) => {

    const [tabItems, setTabItems] = useState<TabItem[]>(items);

    const createTabButton = (label: String, callback: () => void): JSX.Element => {
        return (
            <button className='p-2 px-4 w-max rounded-md border-sky-500 border-2 shadow-sm 
            bg-slate-50 active:bg-slate-100 hover:shadow-md focus:bg-orange-200'
            onClick={callback}
            autoFocus={label === tabItems[0].label}>
                {label}
            </button>
        )
    };


  return (
    <div className='flex flex-row justify-evenly align-middle p-1 min-w-full h-fit border-b-4 border-black'>
        {tabItems.map((item: TabItem) => {
            return createTabButton(item.label, item.callback);
        })}
    </div>
  )
}

export default Tab