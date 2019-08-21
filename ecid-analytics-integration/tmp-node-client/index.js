"use strict";function _interopDefault(e){return e&&"object"==typeof e&&"default"in e?e.default:e}var visitorJsServer=_interopDefault(require("@adobe-mcid/visitor-js-server")),targetDeliveryApiNodeClient=_interopDefault(require("@adobe/target-delivery-api-node-client"));const NOOP_LOGGER={debug(){},error(){}},AT_PREFIX="AT:",isObject=e=>e instanceof Object,isString=e=>"string"==typeof e||e instanceof String,isNumber=e=>"number"==typeof e||e instanceof Number,isPrimitiveObject=e=>e instanceof String||e instanceof Number||e instanceof Boolean||e instanceof Symbol,noUndefinedValues=e=>!!Object.values(e).filter(e=>void 0!==e).length,isNonEmptyObject=e=>isObject(e)&&!Array.isArray(e)&&!isPrimitiveObject(e)&&noUndefinedValues(e),isEmptyObject=e=>!isNonEmptyObject(e),isNonEmptyString=e=>isString(e)&&!!e.length,isEmptyString=e=>!isNonEmptyString(e),isNonEmptyArray=e=>Array.isArray(e)&&!!e.length&&noUndefinedValues(e),isEmptyArray=e=>!isNonEmptyArray(e),removeEmptyKeys=e=>Object.keys(e).forEach(t=>!e[t]&&delete e[t]),getTimezoneOffset=()=>-(new Date).getTimezoneOffset();function getLogger(e){const{logger:t={}}=e,{debug:r,error:i}=t,n=Object.assign({},NOOP_LOGGER);return"function"==typeof r&&(n.debug=(...e)=>{t.debug.apply(null,[AT_PREFIX,...e])}),"function"==typeof i&&(n.error=(...e)=>{t.error.apply(null,[AT_PREFIX,...e])}),n}function normalizeCustomerIds(e){const t=Object.keys(e).reduce((t,r)=>{const i=e[r];return i?(t[r]=t[r]||{},null!=i.id?t[r].id=i.id:t[r].id=i,null!=i.authState?t[r].authState=i.authState:t[r].authState=visitorJsServer.AuthState.UNKNOWN,t):t},{});return isNonEmptyObject(t)?t:void 0}function createTargetOptions(e,t,r,i){const{targetCookie:n,targetLocationHintCookie:s,customerIds:o}=i,a={visitor:e,config:t,logger:r,targetCookie:n,targetLocationHintCookie:s};return o&&(a.customerIds=normalizeCustomerIds(o)),a}function createVisitor(e,t){const{organizationId:r,visitor:i}=t,{visitorCookie:n,customerIds:s}=e,o=i||new visitorJsServer(r,n);return s&&o.setCustomerIDs(s),o}var utils={isNonEmptyObject:isNonEmptyObject,isEmptyObject:isEmptyObject,isNonEmptyString:isNonEmptyString,isEmptyString:isEmptyString,isNonEmptyArray:isNonEmptyArray,isEmptyArray:isEmptyArray,isObject:isObject,isNumber:isNumber,removeEmptyKeys:removeEmptyKeys,getTimezoneOffset:getTimezoneOffset,getLogger:getLogger,createVisitor:createVisitor,createTargetOptions:createTargetOptions},messages={PRIVATE_CONSTRUCTOR:"Please use TargetNodeClient.create static method instead",ORG_ID_REQUIRED:"Organization Id is required",REQUEST_REQUIRED:"Request object is required",EXECUTE_OR_PREFETCH_REQUIRED:"Either execute or prefetch is required in request",EXECUTE_FIELDS_REQUIRED:"Either pageLoad or mboxes is required in execute",PREFETCH_FIELDS_REQUIRED:"Either views, pageLoad or mboxes is required in prefetch",NOTIFICATIONS_REQUIRED:"Notifications array is required in request",CLIENT_REQUIRED:"Client is required",OPTIONS_REQUIRED:"Options map is required",REQUEST_SENT:"Request sent",RESPONSE_RECEIVED:"Response received"};const{isNonEmptyObject:isNonEmptyObject$1,isEmptyObject:isEmptyObject$1,isEmptyArray:isEmptyArray$1,isEmptyString:isEmptyString$1}=utils;function validateClientOptions(e){if(isEmptyObject$1(e))return messages.OPTIONS_REQUIRED;const{client:t,organizationId:r}=e;return isEmptyString$1(t)?messages.CLIENT_REQUIRED:isEmptyString$1(r)?messages.ORG_ID_REQUIRED:null}function validateGetOffersOptions(e){if(isEmptyObject$1(e))return messages.OPTIONS_REQUIRED;const{request:t}=e;if(isEmptyObject$1(t))return messages.REQUEST_REQUIRED;const{execute:r,prefetch:i}=t;return isEmptyObject$1(r)&&isEmptyObject$1(i)?messages.EXECUTE_OR_PREFETCH_REQUIRED:isNonEmptyObject$1(r)&&isEmptyObject$1(r.pageLoad)&&isEmptyArray$1(r.mboxes)?messages.EXECUTE_FIELDS_REQUIRED:isNonEmptyObject$1(i)&&isEmptyObject$1(i.pageLoad)&&isEmptyArray$1(i.views)&&isEmptyArray$1(i.mboxes)?messages.PREFETCH_FIELDS_REQUIRED:null}function validateSendNotificationsOptions(e){if(isEmptyObject$1(e))return messages.OPTIONS_REQUIRED;const{request:t}=e;if(isEmptyObject$1(t))return messages.REQUEST_REQUIRED;const{notifications:r}=t;return isEmptyArray$1(r)?messages.NOTIFICATIONS_REQUIRED:null}var validators={validateClientOptions:validateClientOptions,validateGetOffersOptions:validateGetOffersOptions,validateSendNotificationsOptions:validateSendNotificationsOptions};const TARGET_COOKIE="mbox",SESSION_ID_COOKIE="session",DEVICE_ID_COOKIE="PC",LOCATION_HINT_COOKIE="mboxEdgeCluster";function createInternalCookie(e,t,r){return{name:e,value:t,expires:r}}function serializeCookie(e){return[encodeURIComponent(e.name),encodeURIComponent(e.value),e.expires].join("#")}function deserializeCookie(e){const t=e.split("#"),r=t.length;return 0===r||r<3?null:Number.isNaN(parseInt(t[2],10))?null:createInternalCookie(decodeURIComponent(t[0]),decodeURIComponent(t[1]),Number(t[2]))}function getInternalCookies(e){return e.split("|")}function getExpires(e){return e.expires}function getMaxExpires(e){return Math.max.apply(null,e.map(getExpires))}function parseCookies(e){const t={};if(!e)return t;const r=getInternalCookies(e).map(e=>deserializeCookie(e)),i=Math.ceil(Date.now()/1e3);return r.filter(e=>e&&i<=e.expires).forEach(e=>{t[e.name]=e}),t}function createTargetCookie(e){const t=Date.now(),r=Math.abs(1e3*getMaxExpires(e)-t),i=e.map(e=>serializeCookie(e));return{name:TARGET_COOKIE,value:i.join("|"),maxAge:Math.ceil(r/1e3)}}var cookies={parseCookies:parseCookies,createTargetCookie:createTargetCookie,TARGET_COOKIE:TARGET_COOKIE,SESSION_ID_COOKIE:"session",DEVICE_ID_COOKIE:"PC",LOCATION_HINT_COOKIE:"mboxEdgeCluster"};function random(e,t){return e+Math.floor(Math.random()*(t-e+1))}function uuid(){let e=Date.now();return"xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g,t=>{const r=(e+random(0,16))%16|0;return e=Math.floor(e/16),("x"===t?r:3&r|8).toString(16)})}var uuid_1=uuid,name="@adobe/target-node-client",version="1.0.0",description="Adobe Target Node Client, Delivery API",main="lib/index.js",engines={node:">=8.16.0"},scripts={clean:"rimraf lib",prebuild:"npm run clean && npm run format && npm run lint",build:"rollup -c rollup.config.js",www:"npm run build && node ./sample/server.js",test:"jasmine test/*.spec.js",coverage:"nyc --reporter=lcov --reporter=text-summary npm run test",testdebug:"node --inspect-brk node_modules/jasmine/bin/jasmine.js test/*.spec.js","lint-src":"eslint src/**","lint-test":"eslint test/**",lint:"npm run lint-src && npm run lint-test",format:"prettier --write {src,test}/**/*.js"},repository={type:"git",url:"git@git.corp.adobe.com:TnT/target-node-client.git"},keywords=["NodeJS","Server","API","Adobe","Target","MCID","Visitor","Delivery"],author="Adobe Systems Inc.",license="SEE LICENSE IN LICENSE.txt",devDependencies={"cookie-parser":"^1.4.4",eslint:"^4.19.1","eslint-config-airbnb-base":"^12.1.0","eslint-config-prettier":"^2.10.0","eslint-plugin-import":"^2.14.0","eslint-plugin-prettier":"^2.6.2",express:"^4.17.1",jasmine:"^3.4.0",nyc:"^14.1.1",prettier:"^1.18.2",rimraf:"^2.6.1",rollup:"^1.17.0","rollup-plugin-commonjs":"^10.0.1","rollup-plugin-json":"^4.0.0","rollup-plugin-node-resolve":"^5.2.0","rollup-plugin-terser":"^5.1.1"},dependencies={"@adobe-mcid/visitor-js-server":"^2.0.0","@adobe/target-delivery-api-node-client":"^1.0.2"},_package={name:name,version:version,description:description,main:main,engines:engines,scripts:scripts,"pre-commit":["precommit-msg","format","lint","test"],repository:repository,keywords:keywords,author:author,license:license,devDependencies:devDependencies,dependencies:dependencies},_package$1=Object.freeze({name:name,version:version,description:description,main:main,engines:engines,scripts:scripts,repository:repository,keywords:keywords,author:author,license:license,devDependencies:devDependencies,dependencies:dependencies,default:_package});function getCjsExportFromNamespace(e){return e&&e.default||e}var require$$1=getCjsExportFromNamespace(_package$1);const{AuthenticatedState:AuthenticatedState,CustomerId:CustomerId,VisitorId:VisitorId,Trace:Trace,ChannelType:ChannelType,Context:Context,LoggingType:LoggingType,AnalyticsRequest:AnalyticsRequest,AudienceManager:AudienceManager,ExperienceCloud:ExperienceCloud,ExecuteRequest:ExecuteRequest,PrefetchRequest:PrefetchRequest,MetricType:MetricType,ObjectSerializer:ObjectSerializer,DeliveryRequest:DeliveryRequest,TargetDeliveryApi:TargetDeliveryApi}=targetDeliveryApiNodeClient,{createTargetCookie:createTargetCookie$1,DEVICE_ID_COOKIE:DEVICE_ID_COOKIE$1,LOCATION_HINT_COOKIE:LOCATION_HINT_COOKIE$1,SESSION_ID_COOKIE:SESSION_ID_COOKIE$1}=cookies,{version:version$1}=require$$1,{isObject:isObject$1,isNumber:isNumber$1,isNonEmptyObject:isNonEmptyObject$2,isEmptyObject:isEmptyObject$2,isNonEmptyString:isNonEmptyString$1,isEmptyString:isEmptyString$2,isNonEmptyArray:isNonEmptyArray$1,isEmptyArray:isEmptyArray$2,removeEmptyKeys:removeEmptyKeys$1,getTimezoneOffset:getTimezoneOffset$1}=utils,SCHEME={HTTP:"http://",HTTPS:"https://"},AUTH_STATE={0:AuthenticatedState.Unknown,1:AuthenticatedState.Authenticated,2:AuthenticatedState.LoggedOut},DEFAULT_GLOBAL_MBOX="target-global-mbox",EDGE_CLUSTER_PREFIX="mboxedge",HOST="tt.omtrdc.net",SESSION_ID_MAX_AGE=1860,DEVICE_ID_MAX_AGE=63244800,LOCATION_HINT_MAX_AGE=1860;function extractClusterFromDeviceId(e){if(isEmptyString$2(e))return null;const t=e.split(".");if(2!==t.length||!t[1])return null;const r=t[1].split("_");return 2===r.length&&r[0]?r[0]:null}function getCluster(e,t){return extractClusterFromDeviceId(e)||t}function getDeviceId(e){const t=e[DEVICE_ID_COOKIE$1]||{},{value:r}=t;if(!isEmptyString$2(r))return r}function getSessionId(e,t){const r=e[SESSION_ID_COOKIE$1]||{},{value:i}=r;return isNonEmptyString$1(i)?i:t||uuid_1()}function getTargetHost(e,t,r,i){const n=!1===i?SCHEME.HTTP:SCHEME.HTTPS;return isNonEmptyString$1(e)?`${n}${e}`:isNonEmptyString$1(t)?`${n}${EDGE_CLUSTER_PREFIX}${t}.${HOST}`:`${n}${r}.${HOST}`}function createHeaders(){return{"Content-Type":"application/json","X-EXC-SDK":"AdobeTargetNode","X-EXC-SDK-Version":version$1,"X-Request-Id":uuid_1()}}function getMarketingCloudVisitorId(e){const t=e.getVisitorValues(),{MCMID:r}=t;return r}function getVisitorCustomerIds(e){const t=e.getState();return t[Object.keys(t)[0]].customerIDs}function getCustomerIds(e,t){const r=getVisitorCustomerIds(t);if(isEmptyObject$2(r))return e;const i=Object.keys(r).reduce((e,t)=>{const i=new CustomerId,n=r[t];return n?(isObject$1(n)?(i.id=n.id||void 0,i.integrationCode=t||void 0,i.authenticatedState=AUTH_STATE[n.authState]||void 0):(i.id=n,i.integrationCode=t||void 0,i.authenticatedState=AUTH_STATE[0]),e.push(i),e):e},[]);return i.length?i.concat(e||[]):e}function createVisitorId(e={},t){const{deviceId:r,visitor:i}=t,{tntId:n=r,thirdPartyId:s,marketingCloudVisitorId:o=getMarketingCloudVisitorId(i),customerIds:a}=e,c=getCustomerIds(a,i),u=new VisitorId;return isNonEmptyString$1(n)&&(u.tntId=n),isNonEmptyString$1(s)&&(u.thirdPartyId=s),isNonEmptyString$1(o)&&(u.marketingCloudVisitorId=o),isNonEmptyArray$1(c)&&(u.customerIds=c),isNonEmptyObject$2(u)?u:void 0}function createTrace(e=new Trace){const{authorizationToken:t}=e;if(isNonEmptyString$1(t))return e}function createContext(e={}){const{channel:t,timeOffsetInMinutes:r=getTimezoneOffset$1()}=e;if(Object.keys(ChannelType).includes(t))return e;const i=new Context;return i.channel=ChannelType.Web,i.timeOffsetInMinutes=r,i}function createSupplementalDataId(e){const{visitor:t,consumerId:r=DEFAULT_GLOBAL_MBOX}=e;return t.getSupplementalDataID(r)}function createAnalytics(e={},t){const{supplementalDataId:r=createSupplementalDataId(t),logging:i=LoggingType.ServerSide,trackingServer:n,trackingServerSecure:s}=e,o=new AnalyticsRequest;return o.logging=i,o.supplementalDataId=r,isNonEmptyString$1(n)&&(o.trackingServer=n),isNonEmptyString$1(s)&&(o.trackingServerSecure=s),o}function createAudienceManager(e={},t){const{visitor:r}=t,i=r.getVisitorValues()||{},{locationHint:n=i.MCAAMLH,blob:s=i.MCAAMB}=e,o=new AudienceManager;return n&&(o.locationHint=n),s&&(o.blob=s),isNonEmptyObject$2(o)?o:void 0}function createExperienceCloud(e={},t){const{analytics:r,audienceManager:i}=e,n=new ExperienceCloud;n.analytics=createAnalytics(r,t);const s=createAudienceManager(i,t);return s&&(n.audienceManager=s),n}function createParams(e,t={}){const r=new targetDeliveryApiNodeClient[e],i=Object.assign({},t.parameters);isNonEmptyObject$2(i)&&(r.parameters=i);const n=Object.assign({},t.profileParameters);isNonEmptyObject$2(n)&&(r.profileParameters=n);const s=Object.assign({},t.order);isNonEmptyObject$2(s)&&(r.order=s);const o=Object.assign({},t.product);return isNonEmptyObject$2(o)&&(r.product=o),isNonEmptyObject$2(t.address)&&(r.address=t.address),r}const validMbox=e=>isNonEmptyObject$2(e)&&isNonEmptyString$1(e.name);function createMboxes(e){if(isEmptyArray$2(e))return;const t=e.filter(validMbox).map((e,t)=>{const r=createParams("MboxRequest",e);return r.name=e.name,isNumber$1(e.index)?r.index=e.index:r.index=t,r});return isNonEmptyArray$1(t)?t:void 0}function createViews(e){if(isEmptyArray$2(e))return;const t=e.map(e=>{const t=createParams("ViewRequest",e);return isNonEmptyString$1(e.name)&&(t.name=e.name),isNonEmptyString$1(e.key)&&(t.key=e.key),t});return isNonEmptyArray$1(t)?t:void 0}function createExecute(e){if(isEmptyObject$2(e))return;const{pageLoad:t,mboxes:r}=e;if(isEmptyObject$2(t)&&isEmptyArray$2(r))return;const i=new ExecuteRequest;return isNonEmptyObject$2(t)&&(i.pageLoad=createParams("RequestDetails",t)),isNonEmptyArray$1(r)&&(i.mboxes=createMboxes(r)),i}function createPrefetch(e){if(isEmptyObject$2(e))return;const{pageLoad:t,views:r,mboxes:i}=e;if(isEmptyObject$2(t)&&isEmptyArray$2(r)&&isEmptyArray$2(i))return;const n=new PrefetchRequest;return isNonEmptyObject$2(t)&&(n.pageLoad=createParams("RequestDetails",t)),isNonEmptyArray$1(r)&&(n.views=createViews(r)),isNonEmptyArray$1(i)&&(n.mboxes=createMboxes(i)),n}const validNotification=e=>isNonEmptyObject$2(e)&&isNonEmptyString$1(e.id)&&isNumber$1(e.timestamp)&&Object.keys(MetricType).includes(e.type);function createNotifications(e){if(isEmptyArray$2(e))return;const t=e.filter(validNotification).map(e=>{const{id:t,type:r,timestamp:i,impressionId:n,tokens:s,mbox:o,view:a}=e,c=createParams("Notification",e);return c.id=t,c.type=r,c.timestamp=i,isNonEmptyString$1(n)&&(c.impressionId=n),isNonEmptyArray$1(s)&&(c.tokens=s),isNonEmptyObject$2(o)&&(c.mbox=o),isNonEmptyObject$2(a)&&(c.view=a),c});return isNonEmptyArray$1(t)?t:void 0}function createProperty(e={}){const{token:t}=e;if(isNonEmptyString$1(t))return e}function createDeliveryRequest(e,t){const r=ObjectSerializer.deserialize(e,"DeliveryRequest"),{requestId:i=uuid_1(),impressionId:n,id:s,environmentId:o,property:a,trace:c,context:u,experienceCloud:p,execute:E,prefetch:m,notifications:g,qaMode:l}=r,d=new DeliveryRequest;return d.requestId=i,d.impressionId=n,d.id=createVisitorId(s,t),d.environmentId=o,d.property=createProperty(a),d.trace=createTrace(c),d.context=createContext(u),d.experienceCloud=createExperienceCloud(p,t),d.execute=createExecute(E),d.prefetch=createPrefetch(m),d.notifications=createNotifications(g),d.qaMode=l,removeEmptyKeys$1(d),d}function createDeliveryApi(e,t){const r=new TargetDeliveryApi(e);return r.timeout=t,r}function getTargetCookie(e,t){const r=Math.ceil(Date.now()/1e3),i=[],{tntId:n}=t;return i.push({name:SESSION_ID_COOKIE$1,value:e,expires:r+SESSION_ID_MAX_AGE}),n&&i.push({name:DEVICE_ID_COOKIE$1,value:n,expires:r+DEVICE_ID_MAX_AGE}),createTargetCookie$1(i)}function extractClusterFromEdgeHost(e){if(isEmptyString$2(e))return null;const t=e.split(".");return 4===t.length&&t[0]?t[0].replace(EDGE_CLUSTER_PREFIX,""):null}function getTargetLocationHintCookie(e,t){const r=extractClusterFromEdgeHost(t),i=e||r;if(!isEmptyString$2(i))return{name:LOCATION_HINT_COOKIE$1,value:i,maxAge:LOCATION_HINT_MAX_AGE}}function getAnalyticsFromObject(e={}){const{analytics:t}=e;return isNonEmptyObject$2(t)?[t]:void 0}function getAnalyticsFromArray(e=[]){return e.map(getAnalyticsFromObject).flat()}function getAnalyticsDetails(e){const{execute:t={},prefetch:r={}}=e;if(isEmptyObject$2(t)&&isEmptyObject$2(r))return;const i=[getAnalyticsFromObject(t.pageLoad),getAnalyticsFromArray(t.mboxes),getAnalyticsFromObject(r.pageLoad),getAnalyticsFromArray(r.views),getAnalyticsFromArray(r.mboxes)].filter(e=>!!e).flat();return isNonEmptyArray$1(i)?i:void 0}function getTraceFromObject(e={}){const{trace:t}=e;return isNonEmptyObject$2(t)?[t]:void 0}function getTraceFromArray(e=[]){return e.map(getTraceFromObject).flat()}function getTraceDetails(e){const{execute:t={},prefetch:r={}}=e;if(isEmptyObject$2(t)&&isEmptyObject$2(r))return;const i=[getTraceFromObject(t.pageLoad),getTraceFromArray(t.mboxes),getTraceFromObject(r.pageLoad),getTraceFromArray(r.views),getTraceFromArray(r.mboxes)].filter(e=>!!e).flat();return isNonEmptyArray$1(i)?i:void 0}function getResponseTokensFromObject(e={}){const{options:t}=e;return isEmptyArray$2(t)?[]:t.map(e=>e.responseTokens).filter(isNonEmptyObject$2)}function getResponseTokensFromArray(e=[]){return e.map(getResponseTokensFromObject).flat()}function getResponseTokens(e){const{execute:t={},prefetch:r={}}=e;if(isEmptyObject$2(t)&&isEmptyObject$2(r))return;const i=[getResponseTokensFromObject(t.pageLoad),getResponseTokensFromArray(t.mboxes),getResponseTokensFromObject(r.pageLoad),getResponseTokensFromArray(r.views),getResponseTokensFromArray(r.mboxes)].flat();return isNonEmptyArray$1(i)?i:void 0}function processResponse(e,t,r={}){const{id:i={},edgeHost:n}=r,s={targetCookie:getTargetCookie(e,i),targetLocationHintCookie:getTargetLocationHintCookie(t,n),analyticsDetails:getAnalyticsDetails(r),trace:getTraceDetails(r),responseTokens:getResponseTokens(r),response:r};return removeEmptyKeys$1(s),s}var helper={getDeviceId:getDeviceId,getCluster:getCluster,getSessionId:getSessionId,getTargetHost:getTargetHost,createHeaders:createHeaders,createDeliveryRequest:createDeliveryRequest,createDeliveryApi:createDeliveryApi,processResponse:processResponse,createVisitorId:createVisitorId};const{parseCookies:parseCookies$1}=cookies,{getDeviceId:getDeviceId$1,getCluster:getCluster$1,getSessionId:getSessionId$1,getTargetHost:getTargetHost$1,createHeaders:createHeaders$1,createDeliveryRequest:createDeliveryRequest$1,createDeliveryApi:createDeliveryApi$1,processResponse:processResponse$1}=helper,{REQUEST_SENT:REQUEST_SENT,RESPONSE_RECEIVED:RESPONSE_RECEIVED}=messages;function executeDelivery(e){const{visitor:t,config:r,logger:i,targetLocationHintCookie:n,targetCookie:s,consumerId:o,request:a}=e,{serverDomain:c,client:u,timeout:p,secure:E}=r,m=parseCookies$1(s),g=getDeviceId$1(m),l=getCluster$1(g,n),d=getTargetHost$1(c,l,u,E),y=getSessionId$1(m,e.sessionId),O=createHeaders$1(),I=createDeliveryRequest$1(a,{visitor:t,deviceId:g,consumerId:o});return i.debug(REQUEST_SENT,JSON.stringify(I,null,2)),createDeliveryApi$1(d,p).execute(u,y,I,{headers:O}).then((e={})=>(i.debug(RESPONSE_RECEIVED,JSON.stringify(e.body,null,2)),Object.assign({visitorState:t.getState(),request:I},processResponse$1(y,l,e.body))))}var target={executeDelivery:executeDelivery};const{getLogger:getLogger$1,createVisitor:createVisitor$1}=utils,{validateClientOptions:validateClientOptions$1,validateGetOffersOptions:validateGetOffersOptions$1,validateSendNotificationsOptions:validateSendNotificationsOptions$1}=validators,{executeDelivery:executeDelivery$1}=target,{TARGET_COOKIE:TARGET_COOKIE$1,LOCATION_HINT_COOKIE:LOCATION_HINT_COOKIE$2}=cookies,AMCV_PREFIX="AMCV_",DEFAULT_TIMEOUT=3e3;class TargetNodeClient{constructor(e){if(!e||!e.internal)throw new Error(messages.PRIVATE_CONSTRUCTOR);this.config=e,this.config.timeout=e.timeout||DEFAULT_TIMEOUT,this.logger=getLogger$1(e)}static create(e){const t=validateClientOptions$1(e);if(t)throw new Error(t);return new TargetNodeClient(Object.assign({internal:!0},e))}getOffers(e){const t=validateGetOffersOptions$1(e);if(t)return Promise.reject(new Error(t));const r=createVisitor$1(e,this.config),i=Object.assign({visitor:r,config:this.config,logger:this.logger},e);return executeDelivery$1(i)}sendNotifications(e){const t=validateSendNotificationsOptions$1(e);if(t)return Promise.reject(new Error(t));const r=createVisitor$1(e,this.config),i=Object.assign({visitor:r,config:this.config,logger:this.logger},e);return executeDelivery$1(i)}static getVisitorCookieName(e){return AMCV_PREFIX+e}static get TargetCookieName(){return TARGET_COOKIE$1}static get TargetLocationHintCookieName(){return LOCATION_HINT_COOKIE$2}static get AuthState(){return visitorJsServer.AuthState}}var src=TargetNodeClient;module.exports=src;
//# sourceMappingURL=index.js.map
