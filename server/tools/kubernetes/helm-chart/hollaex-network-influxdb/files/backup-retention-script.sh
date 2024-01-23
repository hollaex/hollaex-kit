#! /usr/bin/env bash

set -e

# This script wants these variable to be set.

## S3_BUCKET <- The name of the bucket where the backups are stored
## S3_ENDPOINT <- The endpoint of the S3 service
## AWS_ACCESS_KEY_ID <- Access credentials        
## AWS_SECRET_ACCESS_KEY <- Access credentials
## DAYS_TO_RETAIN <- The TTL for the backups === number of backups to keep.

# Sanity check to avoid removing all backups.
[[ "$DAYS_TO_RETAIN" -lt 1 ]] && DAYS_TO_RETAIN=1

function get_records {
    before_date="$1"

    aws s3api list-objects \
        --bucket ${S3_BUCKET} \
        --endpoint-url ${S3_ENDPOINT} \
        --query "Contents[?LastModified<='${before_date}'][].{Key: Key}"
}

function remove_old_backups {
    before_date=$(date --iso-8601=seconds -d "-${DAYS_TO_RETAIN} days")  
    now=$(date --iso-8601=seconds)

    del_records=$(get_records "${before_date}")
    all_records=$(get_records "${now}")

    del_paths=()
    all_paths=()
    
    function _jq {
        echo ${row} | base64 --decode | jq -r ${1}
    }

    for row in $(echo "${del_records}" | jq -r '.[] | @base64'); do       
        del_paths+=($(_jq '.Key'))                
    done

    for row in $(echo "${all_records}" | jq -r '.[] | @base64'); do
        all_paths+=($(_jq '.Key'))                
    done

    # Number of backups left if all old backups are removed.
    left=$((${#all_paths[@]} - ${#del_paths[@]}))

    # We ALWAYS keep N backups even if their TTL has expired!
    if (( ${left} < ${DAYS_TO_RETAIN} )); then
        num_to_delete=$((${#all_paths[@]} - ${DAYS_TO_RETAIN}))
    else
        num_to_delete=${#del_paths[@]}
    fi

    for path in "${del_paths[@]::${num_to_delete}}"; do
        aws s3 rm "s3://${S3_BUCKET}/${path}" \
            --endpoint-url "${S3_ENDPOINT}"
    done
}

# Installs jq.
yum install -y jq

remove_old_backups
