import React, {Component} from '../node/node_modules/react';
import {Button, Glyphicon} from '../node/node_modules/react-bootstrap';
import MdwContext from '../react/MdwContext';

class AssetHeader extends Component {
    
  constructor(...args) {
    super(...args);
  }  

  componentDidMount() {
  }

  render() {
    const hubRoot = this.context.hubRoot;
    return (
      <div className="panel-heading mdw-heading" style={{borderColor:'#ddd'}}>
        <div className="mdw-heading-label">
          <div style={{marginTop:'-5px'}}>
            <a href={hubRoot + '/packages/' + this.props.package} style={{marginRight:'1px'}}>
              {this.props.package}
            </a>
            {'/' + this.props.assetName}
            {this.props.asset && 
              <span>
                {this.props.asset.version &&
                  <span>{' v' + this.props.asset.version}</span>
                }
                <a title="Raw" style={{marginLeft:'10px'}}
                  href={hubRoot + '/asset/' + this.props.package + '/' + this.props.asset.name}>
                  <Glyphicon glyph="file" className="mdw-item-icon" />
                </a>
                <a title="Download" style={{marginLeft:'-5px'}}
                  href={hubRoot + '/asset/' + this.props.package + '/' + this.props.asset.name + '?download=true'}>
                  <Glyphicon glyph="download-alt" className="mdw-item-icon" />
                </a>
              </span>
            }
          </div>
          {this.props.asset &&
            <div>
              {this.props.asset.commitInfo &&
                <span className="mdw-commit" style={{fontSize:'13px',marginLeft:'0'}}
                title={this.props.asset.commitInfo.message}>
                  {'(' + this.props.asset.commitInfo.committer + '  ' + this.props.asset.commitInfo.date + ')'}
                </span>
              }
            </div>
          }
        </div>
        {this.props.asset &&
          <div className="mdw-heading-actions">
            <a className="btn btn-primary mdw-action-btn" style={{fontSize:'14px',fontWeight:'normal'}}
              href={hubRoot + '/edit/' + this.props.package + '/' + this.props.asset.name}>
              <Glyphicon glyph="pencil" />
              {' Edit'}
            </a>
            <Button className="btn btn-primary mdw-btn mdw-action-btn" style={{padding:'4px 6px'}}
              onClick={this.props.onUnstage}>
              <Glyphicon glyph="arrow-left" />
              {' Unstage'}
            </Button>
            <Button className="btn btn-primary mdw-btn mdw-action-btn" style={{padding:'4px 6px'}}
              onClick={this.props.onDelete}>
              <Glyphicon glyph="remove" />
              {' Delete'}
            </Button>
          </div>
        }
      </div>
    );
  }
}

AssetHeader.contextType = MdwContext;
export default AssetHeader; 