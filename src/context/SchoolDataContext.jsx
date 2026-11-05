import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { pageLoaders } from '../routers/pageLoaders';

const SchoolDataContext = createContext(null);

export function SchoolDataProvider({ children }) {
  const [data, setData] = useState({});
  const [dataPageKey, setDataPageKey] = useState('');
  const [pageRevisions, setPageRevisions] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const cache = useRef(new Map());
  const requests = useRef(new Map());

  return (
    <SchoolDataContext.Provider value={{ data, setData, dataPageKey, setDataPageKey, pageRevisions, setPageRevisions, loading, setLoading, error, setError, cache, requests }}>
      {children}
    </SchoolDataContext.Provider>
  );
}

export function usePageData(page, token, user, sequence = null, filter = '') {
  const context = useContext(SchoolDataContext);
  if (!context) {
    throw new Error('usePageData must be used within a SchoolDataProvider');
  }
  const { data, setData, dataPageKey, setDataPageKey, pageRevisions, setPageRevisions, loading, setLoading, error, setError, cache, requests } = context;
  const identity = user ? `${token}:${user.id || user.email || user.role}` : '';
  const previousIdentity = useRef(identity);

  useEffect(() => {
    if (previousIdentity.current === identity) return;
    previousIdentity.current = identity;
    cache.current.clear();
    requests.current.clear();
    setData({});
    setDataPageKey('');
    setPageRevisions({});
    setError('');
    setLoading(false);
  }, [identity, cache, setData, setDataPageKey, setPageRevisions, setError, setLoading]);

  useEffect(() => {
    if (!token || !user) return undefined;
    const loadPage = pageLoaders[page];
    if (!loadPage) return undefined;
    const cacheKey = `${identity}:${page}:${filter}:${sequence ?? 'first'}`;

    if (cache.current.has(cacheKey)) {
      const cached = cache.current.get(cacheKey);
      setData(cached.data);
      setDataPageKey(cacheKey);
      setError(cached.error);
      setLoading(false);
      return undefined;
    }

    let active = true;
    setLoading(true);
    setError('');
    let request = requests.current.get(cacheKey);
    if (!request) {
      request = loadPage({ token, user, sequence, filter });
      requests.current.set(cacheKey, request);
    }

    request
      .then((result) => {
        cache.current.set(cacheKey, result);
        if (active) {
          setData(result.data);
          setDataPageKey(cacheKey);
          setError(result.error);
        }
      })
      .catch((requestError) => {
        if (active) setError(`Không tải được dữ liệu mục này: ${requestError.message}`);
      })
      .finally(() => {
        if (requests.current.get(cacheKey) === request) requests.current.delete(cacheKey);
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [identity, page, token, user, sequence, filter, pageRevisions[page] || 0, cache, requests, setData, setDataPageKey, setLoading, setError]);

  function invalidate(...pages) {
    pages.forEach((pageId) => {
      for (const key of cache.current.keys()) {
        if (key.startsWith(`${identity}:${pageId}:`)) cache.current.delete(key);
      }
      for (const key of requests.current.keys()) {
        if (key.startsWith(`${identity}:${pageId}:`)) requests.current.delete(key);
      }
    });
    if (pages.length) {
      setPageRevisions((current) => pages.reduce(
        (revisions, pageId) => ({ ...revisions, [pageId]: (revisions[pageId] || 0) + 1 }),
        current,
      ));
    }
  }

  return { data, dataPageKey, loading, error, invalidate };
}
