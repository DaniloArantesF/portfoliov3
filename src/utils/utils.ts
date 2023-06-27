export const isMobile = () =>
  /Android|webOS|iPhone|iPad/i.test(navigator.userAgent);

export const isSafari = () =>
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

export const sleep = async (ms: number) =>
  await new Promise((r) => setTimeout(r, ms));
