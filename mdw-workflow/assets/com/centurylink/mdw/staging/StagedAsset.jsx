import React, {Component} from '../node/node_modules/react';
import MdwContext from '../react/MdwContext';
import languages from '../react/languages';
import CodeBlock from '../react/CodeBlock.jsx';
import Workflow from '../react/Workflow.jsx';
import CodeDiff from '../react/CodeDiff.jsx';
import AssetHeader from './AssetHeader.jsx';

class StagedAsset extends Component {
    
  constructor(...args) {
    super(...args);

    this.handleUnstage = this.handleUnstage.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleViewChange = this.handleViewChange.bind(this);

    if (this.props.match && this.props.match.params) {
      this.stagingCuid = this.props.match.params.cuid;
      this.package = this.props.match.params.package;
      this.assetName = this.props.match.params.asset;
    }
    this.state = { 
      view: 'asset',
      asset: undefined, 
      content: undefined };
  }

  componentDidMount() {
    if (this.package && this.assetName) {
      let pathPlusParam = this.package + '/' + this.assetName + '?stagingUser=' + this.stagingCuid;
      let url = this.context.serviceRoot + '/Assets/' + pathPlusParam;
      $mdwUi.clearMessage();
      $mdwUi.hubLoading(true);
      let ok = false;
      fetch(new Request(url, {
        method: 'GET',
        headers: { Accept: 'application/json'},
        credentials: 'same-origin'
      }))
      .then(response => {
        $mdwUi.hubLoading(false);
        ok = response.ok;
        return response.json();
      })
      .then(json => {
        if (ok) {
          this.setState({asset: json, content: undefined}, () => {
            let asset = json;
            if (!asset.isBinary) {
              $mdwUi.hubLoading(true);
              url = this.context.hubRoot + '/asset/' + pathPlusParam;
              if (asset.name.endsWith('.proc')) {
                url += '&render=json';
              }
              fetch(new Request(url, {
                method: 'GET',
                credentials: 'same-origin'
              }))
              .then(response => {
                $mdwUi.hubLoading(false);
                ok = response.ok;
                return response.text();
              })
              .then(text => {
                if (ok) {
                  this.setState({asset: asset, content: text});
                }
              });
            }
          });
        }
        else {
          $mdwUi.showMessage(json.status.message);
        }
      });
    }
  }

  handleUnstage() {
    const url = this.context.serviceRoot + '/com/centurylink/mdw/staging/' + 
        this.stagingCuid + '/assets/' + this.package + '/' + this.assetName;
    $mdwUi.clearMessage();
    $mdwUi.hubLoading(true);
    let ok = false;
    fetch(new Request(url, {
      method: 'DELETE',
      headers: { Accept: 'application/json'},
      credentials: 'same-origin'
    }))
    .then(response => {
      $mdwUi.hubLoading(false);
      ok = response.ok;
      return response.json();
    })
    .then(json => {
      if (ok) {
        location = '../';
      }
      else {
        $mdwUi.showMessage(json.status.message);
      }
    });    
  }

  handleDelete() {
    let pathPlusParam = this.package + '/' + this.assetName + '?stagingUser=' + this.stagingCuid;
    let url = this.context.serviceRoot + '/Assets/' + pathPlusParam;
    $mdwUi.clearMessage();
    $mdwUi.hubLoading(true);
    let ok = false;
    fetch(new Request(url, {
      method: 'DELETE',
      headers: { Accept: 'application/json'},
      credentials: 'same-origin'
    }))
    .then(response => {
      $mdwUi.hubLoading(false);
      ok = response.ok;
      return response.json();
    })
    .then(json => {
      if (ok) {
        location = '../';
      }
      else {
        $mdwUi.showMessage(json.status.message);
      }
    });    
  }

  handleViewChange(view) {
    this.setState({
      view: view,
      asset: this.state.asset, 
      content: this.state.content
    });
  }

  render() {
    let extension = undefined;
    let language = undefined;
    if (this.state.asset) {
      extension = this.state.asset.name.substring(this.state.asset.name.lastIndexOf('.') + 1);
      language = languages.getLanguage(extension);
    }

    return (
      <div>
        <AssetHeader 
          package={this.package} 
          assetName={this.assetName} 
          asset={this.state.asset} 
          view={this.state.view}
          onUnstage={this.handleUnstage}
          onDelete={this.handleDelete}
          onViewChange={this.handleViewChange} />
        <div className="mdw-section">
          {this.state.asset && (this.state.asset.isImage || !this.state.asset.isBinary) && this.state.content &&
            <div>
              {this.state.view === 'asset' &&
                <div>
                  {extension === 'proc' &&
                    <Workflow 
                      process={JSON.parse(this.state.content)} 
                      hubBase={this.context.hubRoot} 
                      serviceBase={this.context.serviceRoot} />                  
                  }
                  {extension === 'md' &&
                    <div>TODO</div>
                  }
                  {this.state.asset.isImage &&
                    <img src={this.state.context.hubRoot + '/asset/' + this.package + '/' + this.assetName + '?stagingUser=' + this.stagingCuid}
                      alt={this.state.asset.name} />
                  }
                  {extension !== 'proc' && extension !== 'md' && !this.state.asset.isBinary &&
                    <div>
                      <CodeBlock 
                        language={language} 
                        code={this.state.content} 
                        lineNumbers={true} />
                    </div>
                  }
                </div>
              }
              {this.state.view === 'diff' &&
                <CodeDiff 
                  language={language} 
                  newLabel="Staged"
                  oldLabel="Original"
                  newContent={this.state.content}
                  oldContent={this.state.content} />
              }
            </div>
          }
        </div>
      </div>
    );
  }
}

StagedAsset.contextType = MdwContext;
export default StagedAsset; 