const paths = {
  dashboard: 'M3 13h8V3H3v10Zm0 8h8v-6H3v6Zm10 0h8V11h-8v10Zm0-18v6h8V3h-8Z',
  box: 'M21 8.5 12 3 3 8.5v7l9 5 9-5v-7ZM12 18.2l-6-3.3v-4L12 14l6-3.1v4l-6 3.3ZM12 11 6.1 7.8 12 4.6l5.9 3.2L12 11Z',
  tag: 'M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3.4 13.4A2 2 0 0 1 3 12V5a2 2 0 0 1 2-2h7c.5 0 1 .2 1.4.6l7.2 7.2a2 2 0 0 1 0 2.6ZM7.5 8A1.5 1.5 0 1 0 7.5 5a1.5 1.5 0 0 0 0 3Z',
  users: 'M16 11a4 4 0 1 0-3.9-4.9A5.5 5.5 0 0 1 14 11h2Zm-8 0a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-3.3 0-6 1.7-6 4v2h12v-2c0-2.3-2.7-4-6-4Zm8 .1c-.5 0-1 .1-1.5.2 1 .9 1.5 2.1 1.5 3.7v2h6v-2c0-2.3-2.7-3.9-6-3.9Z',
  clipboard: 'M16 3h-1.2a3 3 0 0 0-5.6 0H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm-4 1.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2ZM16 19H8V5h1v3h6V5h1v14Z',
  plus: 'M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z',
  edit: 'M3 17.3V21h3.7L17.6 10.1l-3.7-3.7L3 17.3ZM20.7 7a1 1 0 0 0 0-1.4l-2.3-2.3a1 1 0 0 0-1.4 0l-1.5 1.5 3.7 3.7L20.7 7Z',
  trash: 'M7 21a2 2 0 0 1-2-2V7h14v12a2 2 0 0 1-2 2H7ZM8 5V3h8v2h5v2H3V5h5Z',
  search: 'm20 19-4.4-4.4a7 7 0 1 0-1 1L19 20l1-1ZM5 10a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z',
}

export function Icon({ name, label }) {
  return <svg className="icon" viewBox="0 0 24 24" aria-hidden={label ? undefined : 'true'} role={label ? 'img' : undefined}><path d={paths[name] || paths.box} />{label && <title>{label}</title>}</svg>
}
