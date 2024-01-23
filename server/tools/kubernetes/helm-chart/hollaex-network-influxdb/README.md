# InfluxDB Helm chart

[InfluxDB](https://github.com/influxdata/influxdb) is an open source time series database with no external dependencies. It's useful for recording metrics, events, and performing analytics.

The InfluxDB Helm chart uses the [Helm](https://helm.sh) package manager to bootstrap an InfluxDB StatefulSet and service on a [Kubernetes](http://kubernetes.io) cluster.

> **Note:** ### If you're using the InfluxDB Enterprise Helm chart, check out [InfluxDB Enterprise Helm chart](#influxdb-enterprise-helm-chart).

## Prerequisites

- Helm v2 or later
- Kubernetes 1.4+
- (Optional) PersistentVolume (PV) provisioner support in the underlying infrastructure

## Install the chart

1. Add the InfluxData Helm repository:

   ```bash
   helm repo add influxdata https://helm.influxdata.com/
   ```

2. Run the following command, providing a name for your release:

   ```bash
   helm upgrade --install my-release influxdata/influxdb
   ```

   > **Tip**: `--install` can be shortened to `-i`.

   This command deploys InfluxDB on the Kubernetes cluster using the default configuration. To find parameters you can configure during installation, see [Configure the chart](#configure-the-chart).

   > **Tip**: To view all Helm chart releases, run `helm list`.

## Uninstall the chart

To uninstall the `my-release` deployment, use the following command:

```bash
helm uninstall my-release
```

This command removes all the Kubernetes components associated with the chart and deletes the release.

## Configure the chart

The following table lists configurable parameters, their descriptions, and their default values stored in `values.yaml`.

| Parameter | Description | Default |
|---|---|---|
| image.repository | Image repository url | influxdb |
| image.tag | Image tag | 1.8.0-alpine |
| image.pullPolicy | Image pull policy | IfNotPresent |
| image.pullSecrets | It will store the repository's credentials to pull image | nil |
| serviceAccount.create | It will create service account | true |
| serviceAccount.name | Service account name | "" |
| serviceAccount.annotations | Service account annotations | {} |
| livenessProbe | Health check for pod | {} |
| readinessProbe | Health check for pod | {} |
| startupProbe | Health check for pod | {} |
| service.type | Kubernetes service type | ClusterIP |
| service.loadBalancerIP | A user-specified IP address for service type LoadBalancer to use as External IP (if supported) | nil |
| service.externalIPs | A user-specified list of externalIPs to add to the service | nil |
| service.externalTrafficPolicy | A user specified external traffic policy | nil |
| persistence.enabled | Boolean to enable and disable persistance | true |
| persistence.existingClaim | An existing PersistentVolumeClaim, ignored if enterprise.enabled=true | nil |
| persistence.storageClass | If set to "-", storageClassName: "", which disables dynamic provisioning. If undefined (the default) or set to null, no storageClassName spec is set, choosing the default provisioner.  (gp2 on AWS, standard on GKE, AWS & OpenStack |  |
| persistence.annotations | Annotations for volumeClaimTemplates | nil |
| persistence.accessMode | Access mode for the volume | ReadWriteOnce |
| persistence.size | Storage size | 8Gi |
| podAnnotations | Annotations for pod | {} |
| podLabels | Labels for pod | {} |
| ingress.enabled | Boolean flag to enable or disable ingress | false |
| ingress.tls | Boolean to enable or disable tls for ingress. If enabled provide a secret in `ingress.secretName` containing TLS private key and certificate. | false |
| ingress.secretName | Kubernetes secret containing TLS private key and certificate. It is `only` required if `ingress.tls` is enabled. | nil |
| ingress.hostname | Hostname for the ingress | influxdb.foobar.com |
| annotations | ingress annotations | nil |
| schedulerName | Use an [alternate scheduler](https://kubernetes.io/docs/tasks/administer-cluster/configure-multiple-schedulers/), e.g. "stork". | nil |
| nodeSelector | Node labels for pod assignment | {} |
| affinity | [Affinity](https://kubernetes.io/docs/concepts/configuration/assign-pod-node/#affinity-and-anti-affinity) for pod assignment |  {|
| tolerations | [Tolerations](https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/) for pod assignment | [] |
| securityContext | [securityContext](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/) for pod | {} |
| env | environment variables for influxdb container | {} |
| volumes | `volumes` stanza(s) to be used in the main container | nil |
| mountPoints | `volumeMount` stanza(s) to be used in the main container | nil |
| extraContainers | Additional containers to be added to the pod | {} |
| config.reporting_disabled | [Details](https://docs.influxdata.com/influxdb/v1.7/administration/config/#reporting-disabled-false) | false |
| config.rpc | RPC address for backup and storage | {} |
| config.meta | [Details](https://docs.influxdata.com/influxdb/v1.7/administration/config/#meta) | {} |
| config.data | [Details](https://docs.influxdata.com/influxdb/v1.7/administration/config/#data) | {} |
| config.coordinator | [Details](https://docs.influxdata.com/influxdb/v1.7/administration/config/#coordinator) | {} |
| config.retention | [Details](https://docs.influxdata.com/influxdb/v1.7/administration/config/#retention) | {} |
| config.shard_precreation | [Details](https://docs.influxdata.com/influxdb/v1.7/administration/config/#shard-precreation) | {} |
| config.monitor | [Details](https://docs.influxdata.com/influxdb/v1.7/administration/config/#monitor) | {} |
| config.http | [Details](https://docs.influxdata.com/influxdb/v1.7/administration/config/#http) | {} |
| config.logging | [Details](https://docs.influxdata.com/influxdb/v1.7/administration/config/#logging) | {} |
| config.subscriber | [Details](https://docs.influxdata.com/influxdb/v1.7/administration/config/#subscriber) | {} |
| config.graphite | [Details](https://docs.influxdata.com/influxdb/v1.7/administration/config/#graphite) | {} |
| config.collectd | [Details](https://docs.influxdata.com/influxdb/v1.7/administration/config/#collectd) | {} |
| config.opentsdb | [Details](https://docs.influxdata.com/influxdb/v1.7/administration/config/#opentsdb) | {} |
| config.udp | [Details](https://docs.influxdata.com/influxdb/v1.7/administration/config/#udp) | {} |
| config.continous_queries | [Details](https://docs.influxdata.com/influxdb/v1.7/administration/config/#continuous-queries) | {} |
| config.tls | [Details](https://docs.influxdata.com/influxdb/v1.7/administration/config/#tls) | {} |
| initScripts.enabled | Boolean flag to enable and disable initscripts. If the container finds any files with the extensions .sh or .iql inside of the /docker-entrypoint-initdb.d folder, it will execute them. The order they are executed in is determined by the shell. This is usually alphabetical order. | false |
| initScripts.scripts | Init scripts | {} |
| backup.enabled | Enable backups, if `true` must configure one of the storage providers | `false` |
| backup.gcs | Google Cloud Storage config | `nil`
| backup.azure | Azure Blob Storage config | `nil`
| backup.s3 | Amazon S3 (or compatible) config | `nil`
| backup.schedule | Schedule to run jobs in cron format | `0 0 * * *` |
| backup.startingDeadlineSeconds | Deadline in seconds for starting the job if it misses its scheduled time for any reason | `nil` |
| backup.annotations | Annotations for backup cronjob | {} |
| backup.podAnnotations | Annotations for backup cronjob pods | {} |
| backup.persistence.enabled | Boolean to enable and disable persistance | false |
| backup.persistence.storageClass | If set to "-", storageClassName: "", which disables dynamic provisioning. If undefined (the default) or set to null, no storageClassName spec is set, choosing the default provisioner.  (gp2 on AWS, standard on GKE, AWS & OpenStack |  |
| backup.persistence.annotations | Annotations for volumeClaimTemplates | nil |
| backup.persistence.accessMode | Access mode for the volume | ReadWriteOnce |
| backup.persistence.size | Storage size | 8Gi |
| backup.resources | Resources requests and limits for `backup` pods | `ephemeral-storage: 8Gi` |

To configure the chart, do either of the following:

- Specify each parameter using the `--set key=value[,key=value]` argument to `helm upgrade --install`. For example:

  ```bash
  helm upgrade --install my-release \
    --set persistence.enabled=true,persistence.size=200Gi \
      influxdata/influxdb
  ```

  This command enables persistence and changes the size of the requested data volume to 200GB.

- Provide a YAML file that specifies the parameter values while installing the chart. For example, use the following command:

  ```bash
  helm upgrade --install my-release -f values.yaml influxdata/influxdb
  ```

  > **Tip**: Use the default [values.yaml](values.yaml).

For information about running InfluxDB in Docker, see the [full image documentation](https://hub.docker.com/_/influxdb/).

### InfluxDB Enterprise Helm chart

[InfluxDB Enterprise](https://www.influxdata.com/products/influxdb-enterprise/) includes features designed for production workloads, including high availability and horizontal scaling. InfluxDB Enterprise requires an InfluxDB Enterprise license.

#### Configure the InfluxDB Enterprise chart

To enable InfluxDB Enterprise, set the following keys and values in a values file provided to Helm.

| Key | Description | Recommended value |
| --- | --- | --- |
| `livenessProbe.initalDelaySeconds` | Used to allow enough time to join meta nodes to a cluster | `3600` |
| `image.tag` | Set to a `data` image. See https://hub.docker.com/_/influxdb for details | `data` |
| `service.ClusterIP` | Use a headless service for StatefulSets | `"None"` |
| `env.name[_HOSTNAME]` | Used to provide a unique `name.service` for InfluxDB. See [values.yaml]() for an example | `valueFrom.fieldRef.fieldPath: metadata.name` |
| `enterprise.enabled` | Create StatefulSets for use with `influx-data` and `influx-meta` images | `true` |
| `enterprise.licensekey` | License for InfluxDB Enterprise |  |
| `enterprise.clusterSize` | Replicas for `influx` StatefulSet | Dependent on license |
| `enterprise.meta.image.tag` | Set to an `meta` image. See https://hub.docker.com/_/influxdb for details | `meta` |
| `enterprise.meta.clusterSize` | Replicas for `influxdb-meta` StatefulSet. | `3` |
| `enterprise.meta.resources` | Resources requests and limits for meta `influxdb-meta` pods | See `values.yaml` |

#### Join pods to InfluxDB Enterprise cluster

Meta and data pods must be joined using the command `influxd-ctl` found on meta pods.
We recommend running `influxd-ctl` on one and only one meta pod and joining meta pods together before data pods. For each meta pod, run `influxd-ctl`.

In the following examples, we use the pod names `influxdb-meta-0` and `influxdb-0` and the service name `influxdb`.

For example, using the default settings, your script should look something like this:

```shell script
kubectl exec influxdb-meta-0 influxd-ctl add-meta influxdb-meta-0.influxdb-meta:8091
```

From the same meta pod, for each data pod, run `influxd-ctl`. With default settings, your script should look something like this:

```shell script
kubectl exec influxdb-meta-0 influxd-ctl add-data influxdb-0.influxdb:8088
```

When using `influxd-ctl`, use the appropriate DNS name for your pods, following the naming scheme of `pod.service`.

## Persistence

The [InfluxDB](https://hub.docker.com/_/influxdb/) image stores data in the `/var/lib/influxdb` directory in the container.

If persistence is enabled, a [Persistent Volume](http://kubernetes.io/docs/user-guide/persistent-volumes/) associated with StatefulSet is provisioned. The volume is created using dynamic volume provisioning. In case of a disruption (for example, a node drain), Kubernetes ensures that the same volume is reattached to the Pod, preventing any data loss. However, when persistence is **not enabled**, InfluxDB data is stored in an empty directory, so if a Pod restarts, data is lost.

## Start with authentication

In `values.yaml`, change `.Values.config.http.auth-enabled` to `true`.

> **Note:** To enforce authentication, InfluxDB requires an admin user to be set up. For details, see [Set up authentication](https://docs.influxdata.com/influxdb/v1.2/query_language/authentication_and_authorization/#set-up-authentication).

To handle this set up during startup, enable a job in `values.yaml` by setting `.Values.setDefaultUser.enabled` to `true`.

Make sure to uncomment or configure the job settings after enabling it. If a password is not set, a random password will be generated.

Alternatively, if `.Values.setDefaultUser.user.existingSecret` is set the user and password are obtained from an existing Secret, the expected keys are `influxdb-user` and `influxdb-password`. Use this variable if you need to check in the `values.yaml` in a repository to avoid exposing your secrets.

## Back up and restore

Before proceeding, please read [Backing up and restoring in InfluxDB OSS](https://docs.influxdata.com/influxdb/v1.7/administration/backup_and_restore/). While the chart offers backups by means of the [`backup-cronjob`](./templates/backup-cronjob.yaml), restores do not fall under the chart's scope today but can be achieved by one-off kubernetes jobs.

### Backups

When enabled, the[`backup-cronjob`](./templates/backup-cronjob.yaml) runs on the configured schedule. One can create a job from the backup cronjob on demand as follows:

```sh
kubectl create job --from=cronjobs/influxdb-backup influx-backup-$(date +%Y%m%d%H%M%S)
```

#### Backup Storage

The backup process consists of an init-container that writes the backup to a
local volume, which is by default an `emptyDir`, shared to the runtime container
which uploads the backup to the configured object store.

In order to avoid filling the node's disk space, it is recommended to set a sufficient
`ephemeral-storage` request or enable persistence, which allocates a PVC.

Furthermore, if no object store provider is available, one can simply use the
PVC as the final storage destination when `persistence` is enabled.

### Restores

It is up to the end user to configure their own one-off restore jobs. Below is just an example, which assumes that the backups are stored in GCS and that all dbs in the backup already exist and should be restored. It is to be used as a reference only; configure the init-container and the command and of the `influxdb-restore` container as well as both containers' resources to suit your needs.

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  generateName: influxdb-restore-
  namespace: monitoring
spec:
  template:
    spec:
      volumes:
        - name: backup
          emptyDir: {}
      serviceAccountName: influxdb
      initContainers:
        - name: init-gsutil-cp
          image: google/cloud-sdk:alpine
          command:
            - /bin/sh
          args:
            - "-c"
            - |
              gsutil -m cp -r gs://<PATH TO BACKUP FOLDER>/* /backup
          volumeMounts:
            - name: backup
              mountPath: /backup
          resources:
            requests:
              cpu: 1
              memory: 4Gi
            limits:
              cpu: 2
              memory: 8Gi
      containers:
        - name: influxdb-restore
          image: influxdb:1.7-alpine
          volumeMounts:
            - name: backup
              mountPath: /backup
          command:
            - /bin/sh
          args:
            - "-c"
            - |
              #!/bin/sh
              INFLUXDB_HOST=influxdb.monitoring.svc
              for db in $(influx -host $INFLUXDB_HOST -execute 'SHOW DATABASES' | tail -n +5); do
                influxd restore -host $INFLUXDB_HOST:8088 -portable -db "$db" -newdb "$db"_bak /backup
              done
          resources:
            requests:
              cpu: 100m
              memory: 128Mi
            limits:
              cpu: 500m
              memory: 512Mi
      restartPolicy: OnFailure
```

At which point the data from the new `<db name>_bak` dbs would have to be side loaded into the original dbs.
Please see [InfluxDB documentation for more restore examples](https://docs.influxdata.com/influxdb/v1.7/administration/backup_and_restore/#restore-examples).

## Mounting Extra Volumes

Extra volumes can be mounted by providing the `volumes` and `mountPoints` keys, consistent
with the behavior of other charts provided by Influxdata.

```yaml
volumes:
- name: ssl-cert-volume
  secret:
    secretName: secret-name
mountPoints:
- name: ssl-cert-volume
  mountPath: /etc/ssl/certs/selfsigned/
  readOnly: true
```

## Upgrading

### From < 1.0.0 To >= 1.0.0

Values `.Values.config.bind_address` and `.Values.exposeRpc` no longer exist. They have been replaced with `.Values.config.rpc.bind_address` and `.Values.config.rpc.enabled` respectively. Please adjust your values file accordingly.

### From < 1.5.0 to >= 2.0.0

The Kubernetes API change to support 1.160 may not be backwards compatible and may require the chart to be uninstalled in order to upgrade.  See [this issue](https://github.com/helm/helm/issues/6583) for some background.

### From < 3.0.0 to >= 3.0.0

Since version 3.0.0 this chart uses a StatefulSet instead of a Deployment. As part of this update the existing persistent volume (and all data) is deleted and a new one is created. Make sure to backup and restore the data manually.

### From < 4.0.0 to >= 4.0.0

Labels are changed in accordance with [Kubernetes recommended labels](https://kubernetes.io/docs/concepts/overview/working-with-objects/common-labels/\#labels). This change also removes the ability to configure clusterIP value to avoid `Error: UPGRADE FAILED: failed to replace object: Service "my-influxdb" is invalid: spec.clusterIP: Invalid value: "": field is immutable` type errors. For more information on this error and why it's important to avoid this error, please see [this Github issue](https://github.com/helm/helm/issues/6378#issuecomment-582764215).

Due to the significance of the changes, we recommend uninstalling and reinstalling the chart (although the PVC shouldn't be deleted during this process, we highly recommended backing up your data beforehand).

Check out our [Slack channel](https://www.influxdata.com/slack) for support and information.
