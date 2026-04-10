/**
 * pages/mite-papers.jsx — Redirects to entrance-tests
 * External links removed (3rd party links banned).
 * Past paper questions are now in the verified bank.
 */

import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function MiTEPapers() {
  const router = useRouter();
  useEffect(() => { router.replace('/entrance-tests'); }, []);
  return null;
}
