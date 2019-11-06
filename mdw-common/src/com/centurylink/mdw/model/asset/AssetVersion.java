package com.centurylink.mdw.model.asset;

import com.centurylink.mdw.dataaccess.AssetRef;
import com.centurylink.mdw.model.Jsonable;
import org.json.JSONObject;

public class AssetVersion implements Jsonable, Comparable<AssetVersion> {

    public AssetVersion(JSONObject json) {
        bind(json);
    }

    public AssetVersion(AssetRef assetRef) {
        String full = assetRef.getName();
        int spV = full.lastIndexOf(" v");
        this.path = full.substring(0, spV);
        this.version = full.substring(spV + 2);
        this.id = assetRef.getDefinitionId();
        this.ref = assetRef.getRef();
    }

    public AssetVersion(Long id, String path, String version) {
        this.id = id;
        this.path = path;
        this.name = path.substring(path.lastIndexOf("/") + 1);
        this.version = version;
    }

    private Long id;
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    private String path;
    public String getPath() { return path; }
    public void setPath(String path) { this.path = path; }

    /**
     * Name is set to make JSON look like AssetInfo.
     */
    private String name;
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    private String version;
    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }

    private String ref;
    public String getRef() { return ref; }
    public void setRef(String ref) { this.ref = ref; }

    private CommitInfo commitInfo;
    public CommitInfo getCommitInfo() { return commitInfo; }
    public void setCommitInfo(CommitInfo commitInfo) { this.commitInfo = commitInfo; }

    private long count;
    public long getCount() { return count; }
    public void setCount(long count) { this.count = count; }

    /**
     * Descending
     */
    @Override
    public int compareTo(AssetVersion otherVersion) {
        return Asset.parseVersion(otherVersion.version) - Asset.parseVersion(version);
    }

    public String toString() {
        return path + " v" + version;
    }
}