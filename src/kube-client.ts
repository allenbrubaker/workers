import { KubeConfig, CoreV1Api } from '@kubernetes/client-node';

const kc = new KubeConfig();
kc.loadFromDefault();
const api = kc.makeApiClient(CoreV1Api);

export const getMyPod = () => process.env.HOSTNAME ?? 'unknown';

export const getPods = async (): Promise<string[]> => {
  const pods = await api.listNamespacedPod('default');
  return pods.body.items
    .filter(x => x.spec?.serviceAccountName === process.env.SERVICE_NAME)
    .map(x => x.metadata?.name)
    .sort() as string[];
};
