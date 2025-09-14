export default function ThemeScript() {
  const code = `(() => {
    try {
      const stored = localStorage.getItem('theme')
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const theme = stored ?? (systemDark ? 'dark' : 'light')
      document.documentElement.classList.toggle('dark', theme === 'dark')
      localStorage.setItem('theme', theme)
      document.cookie = 'theme=' + theme + ';path=/;max-age=' + (60 * 60 * 24 * 365)
    } catch {}
  })();`
  // biome-ignore lint/security/noDangerouslySetInnerHtml: injected client script
  return <script dangerouslySetInnerHTML={{ __html: code }} />
}

