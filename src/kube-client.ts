import k8s from '@kubernetes/client-node';

const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const api = kc.makeApiClient(k8s.CoreV1Api);

export const getMyPod = () => process.env.HOSTNAME ?? 'unknown';

export const getPods = async (): Promise<string[]> => {
  const pods = await api.listNamespacedPod('default');
  return pods.body.items
    .map(x => x.metadata?.name)
    .filter(x => !!x)
    .sort() as string[];
};
