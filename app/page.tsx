'use client'

import Image from '@/components/Image'
import Link from '@/components/Link'
import SocialIcon from '@/components/social-icons'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { useState, useEffect, useRef } from 'react'

const MAX_DISPLAY = 5

const navItems = [
  { href: '/', title: '近期文章', icon: '📝' },
  { href: '/projects', title: '我的项目', icon: '🚀' },
  { href: '/about', title: '关于网站', icon: '💡' },
  { href: '/tags', title: '推荐分享', icon: '🏷️' },
]

function Clock() {
  const [mounted, setMounted] = useState(false)
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  if (!mounted) {
    return (
      <div className="text-right">
        <div className="text-4xl font-light tracking-wider text-gray-700 dark:text-gray-200">
          --:--:--
        </div>
      </div>
    )
  }

  return (
    <div className="text-right" suppressHydrationWarning>
      <div className="text-4xl font-light tracking-wider text-gray-700 dark:text-gray-200">
        {time.toLocaleTimeString('zh-CN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })}
      </div>
    </div>
  )
}

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const today = currentDate.getDate()

  const weekDays = ['日', '一', '二', '三', '四', '五', '六']

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const days = []
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const weekDay = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][currentDate.getDay()]

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  if (!mounted) {
    return <div className="glass-card h-64 p-4"></div>
  }

  return (
    <div
      className="glass-card p-4 transition-transform duration-300 hover:scale-[1.02]"
      suppressHydrationWarning
    >
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={prevMonth}
          className="rounded p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          ◀
        </button>
        <div className="text-lg font-medium text-gray-700 dark:text-gray-200">
          {year}/{month + 1}/{today} {weekDay}
        </div>
        <button
          onClick={nextMonth}
          className="rounded p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          ▶
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {weekDays.map((day) => (
          <div key={day} className="py-1 font-medium text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}
        {days.map((day, index) => (
          <div
            key={index}
            className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-xs ${
              day === today && month === currentDate.getMonth()
                ? 'bg-green-500 font-bold text-white'
                : day
                  ? 'text-gray-600 hover:bg-green-100 dark:text-gray-300 dark:hover:bg-green-900'
                  : ''
            }`}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  )
}

function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  const handlePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="glass-card p-4 transition-transform duration-300 hover:scale-[1.02]">
      <audio ref={audioRef} src="https://music.163.com/song/media/outer/url?id=1824729174.mp3" preload="metadata" />
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-teal-500 text-white shadow-lg">
          <span className="text-2xl">🎵</span>
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
            靠近你 - 李润祺
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
          <div className="mt-1 h-2 w-full cursor-pointer rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-green-400 to-teal-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        <button
          onClick={handlePlay}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-teal-500 text-white shadow-lg transition hover:scale-105 active:scale-95"
        >
          {isPlaying ? (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="ml-0.5 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}

function GreetingSection() {
  const [greeting, setGreeting] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const hour = new Date().getHours()
    if (hour < 6) setGreeting('夜深了')
    else if (hour < 12) setGreeting('早上好')
    else if (hour < 14) setGreeting('中午好')
    else if (hour < 18) setGreeting('下午好')
    else setGreeting('晚上好')
  }, [])

  if (!mounted) {
    return <div className="glass-card h-40 p-6 text-center"></div>
  }

  return (
    <div
      className="glass-card p-6 text-center transition-transform duration-300 hover:scale-[1.02]"
      suppressHydrationWarning
    >
      <div className="mb-4 text-6xl">🐱</div>
      <h2 className="text-xl font-medium text-gray-700 dark:text-gray-200">
        {greeting}，我是{siteMetadata.author.split(' ')[0]}，很高兴见到你！
      </h2>
    </div>
  )
}

export default function Home() {
  const posts = allCoreContent(sortPosts(allBlogs))
  const latestPost = posts[0]

  return (
    <div className="relative min-h-screen p-4 md:p-8">
      <div className="mint-gradient-bg" />
      <div className="relative z-10">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-12 md:gap-6">
          {/* 左侧导航区 */}
          <div className="md:col-span-3">
            <div className="glass-card p-6 transition-transform duration-300 hover:scale-[1.02]">
              <div className="mb-6 text-center">
                <Image
                  src="/static/images/avatar.png"
                  alt="Avatar"
                  width={80}
                  height={80}
                  className="mx-auto mb-3 rounded-full"
                />
                <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                  {siteMetadata.author.split(' ')[0]}
                  <span className="ml-1 text-xs text-gray-400">(开发中)</span>
                </h1>
              </div>
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 transition transition-transform duration-200 hover:scale-[1.02] hover:bg-green-100/50 dark:text-gray-300 dark:hover:bg-green-900/30"
                  >
                    <span>{item.icon}</span>
                    <span>{item.title}</span>
                  </Link>
                ))}
              </nav>
              <div className="mt-6">
                <Link
                  href="/blog"
                  className="block w-full rounded-lg bg-gradient-to-r from-green-400 to-teal-500 py-2 text-center text-sm font-medium text-white shadow-lg transition hover:scale-[1.02] active:scale-[0.98]"
                >
                  ✨ 优秀博客
                </Link>
              </div>
            </div>
          </div>

          {/* 中间主内容区 */}
          <div className="md:col-span-6">
            <div className="space-y-4 md:space-y-6">
              {/* 顶部问候区 */}
              <GreetingSection />

              {/* 功能按钮区 */}
              <div className="flex items-center justify-between">
                <div className="transition-transform duration-300 hover:scale-[1.02]">
                  <Link
                    href="/blog"
                    className="glass-card px-6 py-3 font-medium text-green-600 transition hover:bg-green-100/50 dark:text-green-400 dark:hover:bg-green-900/30"
                  >
                    ✍️ 写文章
                  </Link>
                </div>
                <Clock />
              </div>

              {/* 最新文章区 */}
              <div className="glass-card p-6 transition-transform duration-300 hover:scale-[1.02]">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-800 dark:text-gray-100">
                  <span>📝</span> 最新文章
                </h3>
                {latestPost ? (
                  <Link
                    href={`/blog/${latestPost.slug}`}
                    className="group block transition-transform duration-200 hover:scale-[1.01]"
                  >
                    <div className="rounded-lg bg-white/30 p-4 transition group-hover:bg-white/50 dark:bg-gray-800/30 dark:group-hover:bg-gray-800/50">
                      <h4 className="mb-2 font-medium text-gray-800 dark:text-gray-100">
                        {latestPost.title}
                      </h4>
                      <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-600 dark:bg-green-900 dark:text-green-400">
                          进行中
                        </span>
                        <span>{formatDate(latestPost.date, siteMetadata.locale)}</span>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">暂无文章</p>
                )}

                {/* 文章列表 */}
                <div className="mt-4 space-y-3">
                  {posts.slice(1, MAX_DISPLAY).map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="group flex items-center justify-between rounded-lg bg-white/20 p-3 transition transition-transform duration-200 hover:scale-[1.01] hover:bg-white/40 dark:bg-gray-800/20 dark:hover:bg-gray-800/40"
                    >
                      <span className="text-gray-700 dark:text-gray-200">{post.title}</span>
                      <span className="text-sm text-gray-400">
                        {formatDate(post.date, siteMetadata.locale)}
                      </span>
                    </Link>
                  ))}
                </div>

                {posts.length > MAX_DISPLAY && (
                  <div className="mt-4 text-center">
                    <Link
                      href="/blog"
                      className="text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                    >
                      查看更多文章 →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 右侧区域 */}
          <div className="md:col-span-3">
            <div className="space-y-4 md:space-y-6">
              {/* 日历区 */}
              <Calendar />

              {/* 社交链接区 */}
              <div className="glass-card p-4 transition-transform duration-300 hover:scale-[1.02]">
                <h3 className="mb-3 text-sm font-medium text-gray-600 dark:text-gray-300">
                  社交链接
                </h3>
                <div className="flex flex-wrap gap-3">
                  <div className="transition-transform duration-200 hover:scale-110">
                    <SocialIcon kind="github" href={siteMetadata.github} size={6} />
                  </div>
                </div>
              </div>

              {/* 音乐播放器 */}
              <MusicPlayer />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
