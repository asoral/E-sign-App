import React from 'react'

export const TextIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" height="2em" width="2em" {...props}>
    <path d="M5 8h2V6h3.252L7.68 18H5v2h8v-2h-2.252L13.32 6H17v2h2V4H5z" />
  </svg>
);

export const ViewTextIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
      viewBox="0 0 640 512"
      fill="currentColor"
      height="2em"
      width="2em"
      {...props}
    >
      <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2s-6.3 25.5 4.1 33.7l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L355.7 253.5 400.2 96H503l-6 24.2c-4.3 17.1 6.1 34.5 23.3 38.8s34.5-6.1 38.8-23.3l16-64c2.4-9.6.2-19.7-5.8-27.5S553.9 32 544 32H192c-14.7 0-27.5 10-31 24.2l-9.3 37.3L38.8 5.1zm168 131.7c.1-.3.2-.7.3-1L217 96h116.7l-32.4 114.8-94.5-74.1zM243.3 416H192c-17.7 0-32 14.3-32 32s14.3 32 32 32h160c17.7 0 32-14.3 32-32s-14.3-32-32-32h-42.2l17.6-62.1-54.5-42.9-29.6 105z" />
    </svg>
);

export const SignatureIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
  fill="none"
  stroke="currentColor"
  strokeLinecap="round"
  strokeLinejoin="round"
  strokeWidth={2}
  viewBox="0 0 24 24"
  height="2em"
  width="2em"
  {...props}
>
  <path stroke="none" d="M0 0h24v24H0z" />
  <path d="M3 17c3.333-3.333 5-6 5-8 0-3-1-3-2-3S3.968 7.085 4 9c.034 2.048 1.658 4.877 2.5 6C8 17 9 17.5 10 16l2-3c.333 2.667 1.333 4 3 4 .53 0 2.639-2 3-2 .517 0 1.517.667 3 2" />
</svg>
);

export const ViewSignatureIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
      viewBox="0 0 640 512"
      fill="currentColor"
      height="2em"
      width="2em"
      {...props}
    >
      <path d="M192 128c0-17.7 14.3-32 32-32s32 14.3 32 32v7.8c0 27.7-2.4 55.3-7.1 82.5l-84.4 25.3c-40.6 12.2-68.4 49.6-68.4 92v71.9c0 40 32.5 72.5 72.5 72.5 26 0 50-13.9 62.9-36.5l13.9-24.3c26.8-47 46.5-97.7 58.4-150.5l94.4-28.3-12.5 37.5c-3.3 9.8-1.6 20.5 4.4 28.8s15.7 13.3 26 13.3H544c17.7 0 32-14.3 32-32s-14.3-32-32-32h-83.6l18-53.9c3.8-11.3.9-23.8-7.4-32.4s-20.7-11.8-32.2-8.4l-122.4 36.8c2.4-20.7 3.6-41.4 3.6-62.3V128c0-53-43-96-96-96s-96 43-96 96v32c0 17.7 14.3 32 32 32s32-14.3 32-32v-32zm-9.2 177l49-14.7c-10.4 33.8-24.5 66.4-42.1 97.2l-13.9 24.3c-1.5 2.6-4.3 4.3-7.4 4.3-4.7 0-8.5-3.8-8.5-8.5v-72c0-14.1 9.3-26.6 22.8-30.7zM24 368c-13.3 0-24 10.7-24 24s10.7 24 24 24h40.3c-.2-2.8-.3-5.6-.3-8.5V368H24zm592 48c13.3 0 24-10.7 24-24s-10.7-24-24-24H305.9c-6.7 16.3-14.2 32.3-22.3 48H616z" />
    </svg>
);

export const ImageIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
  viewBox="0 0 24 24"
  fill="currentColor"
  height="2em"
  width="2em"
  {...props}
>
  <path d="M22.7 14.3l-1 1-2-2 1-1c.1-.1.2-.2.4-.2.1 0 .3.1.4.2l1.3 1.3c.1.2.1.5-.1.7M13 19.9V22h2.1l6.1-6.1-2-2-6.2 6m-1.79-4.07l-1.96-2.36L6.5 17h6.62l2.54-2.45-1.7-2.26-2.75 3.54M11 19.9v-.85l.05-.05H5V5h14v6.31l2-1.93V5a2 2 0 00-2-2H5c-1.1 0-2 .9-2 2v14a2 2 0 002 2h6v-1.1z" />
</svg>
);


export const ViewImageIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="2em"
      width="2em"
      {...props}
    >
      <path d="M21.8 16v-1.5c0-1.4-1.4-2.5-2.8-2.5s-2.8 1.1-2.8 2.5V16c-.6 0-1.2.6-1.2 1.2v3.5c0 .7.6 1.3 1.2 1.3h5.5c.7 0 1.3-.6 1.3-1.2v-3.5c0-.7-.6-1.3-1.2-1.3m-1.3 0h-3v-1.5c0-.8.7-1.3 1.5-1.3s1.5.5 1.5 1.3V16M5 3c-1.1 0-2 .9-2 2v14a2 2 0 002 2h8.03c-.03-.1-.03-.2-.03-.3V19H5V5h14v5c.69 0 1.37.16 2 .42V5a2 2 0 00-2-2H5m8.96 9.29l-2.75 3.54-1.96-2.36L6.5 17H13c.08-.86.46-1.54.96-2.04.07-.07.17-.11.24-.17v-.29c0-.55.1-1.06.27-1.53l-.51-.68z" />
    </svg>
);

export const CheckBoxIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
  viewBox="0 0 512 512"
  fill="currentColor"
  height="2em"
  width="2em"
  {...props}
>
  <path
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={32}
    d="M352 176L217.6 336 160 272"
  />
  <path
    fill="none"
    stroke="currentColor"
    strokeLinejoin="round"
    strokeWidth={32}
    d="M112 64 H400 A48 48 0 0 1 448 112 V400 A48 48 0 0 1 400 448 H112 A48 48 0 0 1 64 400 V112 A48 48 0 0 1 112 64 z"
  />
</svg>
);

export const ManualDateIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      height="2em"
      width="2em"
      {...props}
    >
      <path d="M15 2h2a2 2 0 012 2v14a2 2 0 01-2 2H3a2 2 0 01-2-2V4c0-1.1.9-2 2-2h2V0h2v2h6V0h2v2zM3 6v12h14V6H3zm6 5V9h2v2h2v2h-2v2H9v-2H7v-2h2z" />
    </svg>
);

export const LiveDateIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
  viewBox="0 0 21 21"
  fill="currentColor"
  height="2em"
  width="2em"
  {...props}
>
  <g fill="none" fillRule="evenodd">
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.5 2.5h12a2 2 0 012 2v11.99a2 2 0 01-2 2h-12a2 2 0 01-2-2V4.5a2 2 0 012-2zM2.659 6.5H18.5"
    />
    <g fill="currentColor">
      <path d="M6.816 13.155v-1.079h.88c.668 0 1.122-.395 1.122-.972 0-.527-.415-.927-1.103-.927-.713 0-1.152.366-1.201.996H5.15C5.201 9.874 6.201 9 7.788 9c1.563 0 2.432.864 2.427 1.895-.005.854-.542 1.416-1.299 1.601v.093c.981.141 1.577.766 1.577 1.709 0 1.235-1.162 2.11-2.754 2.11S5.063 15.537 5 14.204h1.411c.044.596.552.977 1.309.977.747 0 1.27-.406 1.27-1.016 0-.625-.489-1.01-1.28-1.01zM13.516 16.227v-5.611h-.087L11.7 11.808v-1.372l1.821-1.255h1.47v7.046z" />
    </g>
  </g>
</svg>
);

export const FixDateIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
      fill="currentColor"
      viewBox="0 0 16 16"
      height="2em"
      width="2em"
      {...props}
    >
      <path d="M6.445 12.688V7.354h-.633A12.6 12.6 0 004.5 8.16v.695c.375-.257.969-.62 1.258-.777h.012v4.61h.675zm1.188-1.305c.047.64.594 1.406 1.703 1.406 1.258 0 2-1.066 2-2.871 0-1.934-.781-2.668-1.953-2.668-.926 0-1.797.672-1.797 1.809 0 1.16.824 1.77 1.676 1.77.746 0 1.23-.376 1.383-.79h.027c-.004 1.316-.461 2.164-1.305 2.164-.664 0-1.008-.45-1.05-.82h-.684zm2.953-2.317c0 .696-.559 1.18-1.184 1.18-.601 0-1.144-.383-1.144-1.2 0-.823.582-1.21 1.168-1.21.633 0 1.16.398 1.16 1.23z" />
      <path d="M3.5 0a.5.5 0 01.5.5V1h8V.5a.5.5 0 011 0V1h1a2 2 0 012 2v11a2 2 0 01-2 2H2a2 2 0 01-2-2V3a2 2 0 012-2h1V.5a.5.5 0 01.5-.5zM2 2a1 1 0 00-1 1v11a1 1 0 001 1h12a1 1 0 001-1V3a1 1 0 00-1-1H2z" />
      <path d="M2.5 4a.5.5 0 01.5-.5h10a.5.5 0 01.5.5v1a.5.5 0 01-.5.5H3a.5.5 0 01-.5-.5V4z" />
    </svg>
);


export type ButtonType =
  | 'text'
  | 'v_text'
  | 'signature'
  | 'v_signature'
  | 'image'
  | 'v_image'
  | 'checkbox'
  | 'm_date'
  | 'live_date'
  | 'fix_date';

  export const buttonConfigs: { type: ButtonType; icon: React.ReactNode; title: string }[] = [
    { type: 'text', icon: <TextIcon />, title: 'Edit Text' },
    // { type: 'v_text', icon: <ViewTextIcon />, title: 'View Text' },
    { type: 'signature', icon: <SignatureIcon />, title: 'Signature' },
    // { type: 'v_signature', icon: <ViewSignatureIcon />, title: 'View-Sign' },
    { type: 'image', icon: <ImageIcon />, title: 'Image' },
    // { type: 'v_image', icon: <ViewImageIcon />, title: 'View Image' },
    { type: 'checkbox', icon: <CheckBoxIcon />, title: 'Checkbox' },
    { type: 'm_date', icon: <ManualDateIcon />, title: 'Date' },
    { type: 'live_date', icon: <LiveDateIcon />, title: 'Live Date' },
    // { type: 'fix_date', icon: <FixDateIcon />, title: 'Fix Date' },
  ];
  

