import React, { useEffect } from 'react'
import { assets } from '../assets/assets'
import moment from 'moment'
import Markdown from 'react-markdown'
import Prism from 'prismjs'

const Message = ({ message }) => {

  useEffect(() => {
    Prism.highlightAll()
  }, [message.content])

  // Blocked AI response bubble

  if (message.blocked) {
    return (
      <div className="flex items-start my-4">
        <img
          src={assets.ai_icon}
          alt=""
          className="w-8 h-8 rounded-full self-start opacity-80"
        />
        <div className="ml-2 inline-flex flex-col gap-1 p-3 px-4 max-w-2xl bg-red-500/10 border border-red-500/50 rounded-md">
          <span className="text-sm font-semibold text-red-600 dark:text-red-300 flex items-center gap-1">
            🚫 Blocked
            {message.type && (
              <span className="text-[10px] bg-red-500/20 border border-red-500/30 text-red-700 dark:text-red-200 px-1 py-[1px] rounded-md uppercase">
                {message.type}
              </span>
            )}
          </span>

          {message.content && (
            <p className="text-xs text-red-700 dark:text-red-200">
              {message.content}
            </p>
          )}

          {message.reason && (
            <p className="text-[11px] italic text-red-500 dark:text-red-300">
              {message.reason}
            </p>
          )}

          <span className="text-[10px] opacity-60">
            {moment(message.timestamp).fromNow()}
          </span>
        </div>
      </div>
    );
  }


  return (
    <div>
      {message.role === "user" ? (
        <div className='flex items-start justify-end my-4 gap-2'>
          <div className='flex flex-col gap-2 p-2 px-4 bg-slate-50 dark:bg-[#57317C]/30 border border-[#80609F]/30 rounded-md max-w-2xl'>
            <p className='text-sm dark:text-primary'>{message.content}</p>
            <span className='text-xs text-gray-400 dark:text-[#B1A6C0]'>
              {moment(message.timestamp).fromNow()}
            </span>
          </div>
          <img src={assets.user_icon} alt="" className='w-8 rounded-full' />
        </div>
      ) : (
        <div className='inline-flex flex-col gap-2 p-2 px-4 max-w-2xl bg-primary/20 dark:bg-[#57317C]/30 border border-[#80609F]/30 rounded-md my-4'>
          {message.isImage ? (
            <img src={message.content} alt="" className='w-full max-w-md mt-2 rounded-md' />
          ) : (
            <div className='text-sm dark:text-primary reset-tw'>
              <Markdown>{message.content}</Markdown>
            </div>
          )}
          <span className='text-xs text-gray-400 dark:text-[#B1A6C0]'>
            {moment(message.timestamp).fromNow()}
          </span>
        </div>
      )}
    </div>
  )
}

export default Message
