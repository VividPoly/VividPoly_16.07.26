type GmailComposeParams = {
  to: string;
  subject?: string;
  body?: string;
  cc?: string;
  bcc?: string;
};

/** Opens Gmail web compose with pre-filled fields (Gmail compose URL API). */
export function buildGmailComposeUrl({ to, subject, body, cc, bcc }: GmailComposeParams) {
  const params = new URLSearchParams({
    view: 'cm',
    fs: '1',
  });

  if (to.trim()) params.set('to', to.trim());
  if (subject?.trim()) params.set('su', subject.trim());
  if (body?.trim()) params.set('body', body.trim());
  if (cc?.trim()) params.set('cc', cc.trim());
  if (bcc?.trim()) params.set('bcc', bcc.trim());

  return `https://mail.google.com/mail/?${params.toString()}`;
}

export function openGmailCompose(params: GmailComposeParams, target = '_blank') {
  const url = buildGmailComposeUrl(params);
  const win = window.open(url, target, 'noopener,noreferrer');
  if (!win) {
    window.location.assign(url);
  }
  return url;
}
