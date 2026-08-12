(function () {
  let vwoClient = null;
  let vwoClientPromise = null;

  async function getVWOClient() {
    if (vwoClient) return vwoClient;
    if (vwoClientPromise) return vwoClientPromise;
    const { accountId, sdkKey } = window.VWO_FME_CONFIG || {};
    if (!accountId || !sdkKey) {
      throw new Error('Missing VWO_FME_CONFIG');
    }
    vwoClientPromise = (async () => {
      const client = await vwoSdk.init({ accountId, sdkKey });
      vwoClient = client;
      window.vwoClient = client;
      return client;
    })();
    return vwoClientPromise;
  }

  async function reinitializeClient() {
    // Clear cached client instances so next call initializes a fresh one
    vwoClient = null;
    vwoClientPromise = null;
    return getVWOClient();
  }

  function buildUserContext(id) {
    const stored = localStorage.getItem('customVariables');
    let customVariables = {};
    try {
      customVariables = stored ? JSON.parse(stored) : {};
    } catch (_) {
      customVariables = {};
    }
    if (customVariables && typeof customVariables === 'object') {
      delete customVariables.id;
    }
    // Build context with both nested and mirrored top-level keys (excluding reserved ones)
    const userContext = { id, customVariables };
    Object.keys(customVariables || {}).forEach((key) => {
      if (key === 'id' || key === 'customVariables') return;
      userContext[key] = customVariables[key];
    });
    return userContext;
  }

  window.VWOSetup = {
    getVWOClient,
    buildUserContext,
    getFlagKey: function () { return (window.VWO_FME_CONFIG && window.VWO_FME_CONFIG.flagKey) || 'promoBanner12'; },
    reinitializeClient
  };
})();
