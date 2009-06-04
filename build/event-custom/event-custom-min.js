YUI.add("event-custom",function(G){G.Env.evt={handles:{},plugins:{}};(function(){var H=0,I=1;G.Do={objs:{},before:function(K,M,N,O){var L=K,J;if(O){J=[K,O].concat(G.Array(arguments,4,true));L=G.rbind.apply(G,J);}return this._inject(H,L,M,N);},after:function(K,M,N,O){var L=K,J;if(O){J=[K,O].concat(G.Array(arguments,4,true));L=G.rbind.apply(G,J);}return this._inject(I,L,M,N);},_inject:function(J,L,M,O){var P=G.stamp(M),N,K;if(!this.objs[P]){this.objs[P]={};}N=this.objs[P];if(!N[O]){N[O]=new G.Do.Method(M,O);M[O]=function(){return N[O].exec.apply(N[O],arguments);};}K=P+G.stamp(L)+O;N[O].register(K,L,J);return new G.EventHandle(N[O],K);},detach:function(J){if(J.detach){J.detach();}},_unload:function(K,J){}};G.Do.Method=function(J,K){this.obj=J;this.methodName=K;this.method=J[K];this.before={};this.after={};};G.Do.Method.prototype.register=function(K,L,J){if(J){this.after[K]=L;}else{this.before[K]=L;}};G.Do.Method.prototype._delete=function(J){delete this.before[J];delete this.after[J];};G.Do.Method.prototype.exec=function(){var L=G.Array(arguments,0,true),M,K,P,N=this.before,J=this.after,O=false;for(M in N){if(N.hasOwnProperty(M)){K=N[M].apply(this.obj,L);if(K){switch(K.constructor){case G.Do.Halt:return K.retVal;case G.Do.AlterArgs:L=K.newArgs;break;case G.Do.Prevent:O=true;break;default:}}}}if(!O){K=this.method.apply(this.obj,L);}for(M in J){if(J.hasOwnProperty(M)){P=J[M].apply(this.obj,L);if(P&&P.constructor==G.Do.Halt){return P.retVal;}else{if(P&&P.constructor==G.Do.AlterReturn){K=P.newRetVal;}}}}return K;};G.Do.AlterArgs=function(K,J){this.msg=K;this.newArgs=J;};G.Do.AlterReturn=function(K,J){this.msg=K;this.newRetVal=J;};G.Do.Halt=function(K,J){this.msg=K;this.retVal=J;};G.Do.Prevent=function(J){this.msg=J;};G.Do.Error=G.Do.Halt;})();(function(){G.EventFacade=function(I,H){I=I||{};this.details=I.details;this.type=I.type;this.target=I.target;this.currentTarget=H;this.relatedTarget=I.relatedTarget;this.stopPropagation=function(){I.stopPropagation();};this.stopImmediatePropagation=function(){I.stopImmediatePropagation();};this.preventDefault=function(){I.preventDefault();};this.halt=function(J){I.halt(J);};};})();var F="after",C=["broadcast","bubbles","context","configured","currentTarget","defaultFn","details","emitFacade","fireOnce","host","preventable","preventedFn","queuable","silent","stoppedFn","target","type"],A=new G.EventFacade(),D=G.Object.keys(A),E=9,B="yui:log";G.EventHandle=function(H,I){this.evt=H;this.sub=I;};G.EventHandle.prototype={detach:function(){if(this.evt){this.evt._delete(this.sub);}}};G.CustomEvent=function(H,I){I=I||{};this.id=G.stamp(this);this.type=H;this.context=G;this.logSystem=(H==B);this.silent=this.logSystem;this.subscribers={};this.afters={};this.preventable=true;this.bubbles=true;this.signature=E;this.applyConfig(I,true);};G.CustomEvent.prototype={_YUI_EVENT:true,applyConfig:function(I,H){if(I){G.mix(this,I,H,C);}},_on:function(L,J,I,H){if(!L){G.error("Invalid callback for CE: "+this.type);}var K=new G.Subscriber(L,J,I,H);if(this.fireOnce&&this.fired){G.later(0,this,this._notify,K);}if(H==F){this.afters[K.id]=K;this.hasAfters=true;}else{this.subscribers[K.id]=K;this.hasSubscribers=true;}return new G.EventHandle(this,K);},subscribe:function(I,H){return this._on(I,H,arguments,true);},on:function(I,H){return this._on(I,H,arguments,true);},after:function(I,H){return this._on(I,H,arguments,F);},detach:function(L,J){if(L&&L.detach){return L.detach();}if(!L){return this.unsubscribeAll();}var M=false,I=this.subscribers,H,K;for(H in I){if(I.hasOwnProperty(H)){K=I[H];if(K&&K.contains(L,J)){this._delete(K);M=true;}}}return M;},unsubscribe:function(){return this.detach.apply(this,arguments);},_getFacade:function(){var H=this._facade,K,I=this.details,J;if(!H){H=new G.EventFacade(this,this.currentTarget);}K=I&&I[0];if(G.Lang.isObject(K,true)){J={};G.mix(J,H,true,D);G.mix(H,K,true);G.mix(H,J,true,D);}H.details=this.details;H.target=this.target;H.currentTarget=this.currentTarget;H.stopped=0;H.prevented=0;this._facade=H;return this._facade;},_notify:function(L,J,H){this.log(this.type+"->"+": "+L);var I,K;if(this.emitFacade){if(!H){H=this._getFacade(J);if(G.Lang.isObject(J[0])){J[0]=H;}else{J.unshift(H);}}}I=L.notify(K||this.context,J,this);if(false===I||this.stopped>1){this.log(this.type+" cancelled by subscriber");return false;}return true;},log:function(I,H){if(!this.silent){}},fire:function(){var Q=G.Env._eventstack,J,S,P,K,L,H,M,I,N,O=true,R;if(Q){if(this.queuable&&this.type!=Q.next.type){this.log("queue "+this.type);Q.queue.push([this,arguments]);return true;}}else{G.Env._eventstack={id:this.id,next:this,silent:this.silent,logging:(this.type===B),stopped:0,prevented:0,queue:[]};Q=G.Env._eventstack;}if(this.fireOnce&&this.fired){this.log("fireOnce event: "+this.type+" already fired");}else{P=G.Array(arguments,0,true);this.stopped=0;this.prevented=0;this.target=this.target||this.host;R=new G.EventTarget({fireOnce:true,context:this.host});this.events=R;if(this.preventedFn){R.on("prevented",this.preventedFn);}if(this.stoppedFn){R.on("stopped",this.stoppedFn);}this.currentTarget=this.host||this.currentTarget;this.fired=true;this.details=P.slice();this.log("Firing "+this.type);N=false;Q.lastLogState=Q.logging;L=null;if(this.emitFacade){this._facade=null;L=this._getFacade(P);if(G.Lang.isObject(P[0])){P[0]=L;}else{P.unshift(L);}}if(this.hasSubscribers){J=G.merge(this.subscribers);for(K in J){if(J.hasOwnProperty(K)){if(!N){Q.logging=(Q.logging||(this.type===B));N=true;}if(this.stopped==2){break;}S=J[K];if(S&&S.fn){O=this._notify(S,P,L);if(false===O){this.stopped=2;}}}}}Q.logging=(Q.lastLogState);if(this.bubbles&&this.host&&!this.stopped){Q.stopped=0;Q.prevented=0;O=this.host.bubble(this);this.stopped=Math.max(this.stopped,Q.stopped);this.prevented=Math.max(this.prevented,Q.prevented);}if(this.defaultFn&&!this.prevented){this.defaultFn.apply(this.host||this,P);}if(!this.stopped&&this.broadcast){if(this.host!==G){G.fire.apply(G,P);}if(this.broadcast==2){G.Global.fire.apply(G.Global,P);
}}if(this.hasAfters&&!this.prevented&&this.stopped<2){J=G.merge(this.afters);for(K in J){if(J.hasOwnProperty(K)){if(!N){Q.logging=(Q.logging||(this.type===B));N=true;}if(this.stopped==2){break;}S=J[K];if(S&&S.fn){O=this._notify(S,P,L);if(false===O){this.stopped=2;}}}}}}if(Q.id===this.id){M=Q.queue;while(M.length){H=M.pop();I=H[0];Q.stopped=0;Q.prevented=0;Q.next=I;O=I.fire.apply(I,H[1]);}G.Env._eventstack=null;}return(O!==false);},unsubscribeAll:function(){return this.detachAll.apply(this,arguments);},detachAll:function(){var J=this.subscribers,I,H=0;for(I in J){if(J.hasOwnProperty(I)){this._delete(J[I]);H++;}}this.subscribers={};return H;},_delete:function(H){if(H){delete H.fn;delete H.context;delete this.subscribers[H.id];delete this.afters[H.id];}},toString:function(){return this.type;},stopPropagation:function(){this.stopped=1;G.Env._eventstack.stopped=1;this.events.fire("stopped",this);},stopImmediatePropagation:function(){this.stopped=2;G.Env._eventstack.stopped=2;this.events.fire("stopped",this);},preventDefault:function(){if(this.preventable){this.prevented=1;G.Env._eventstack.prevented=1;this.events.fire("prevented",this);}},halt:function(H){if(H){this.stopImmediatePropagation();}else{this.stopPropagation();}this.preventDefault();}};G.Subscriber=function(J,I,H){this.fn=J;this.context=I;this.id=G.stamp(this);this.wrappedFn=J;this.events=null;if(I){this.wrappedFn=G.rbind.apply(G,H);}};G.Subscriber.prototype={notify:function(H,J,M){var N=this.context||H,I=true,K=function(){switch(M.signature){case 0:I=this.fn.call(N,M.type,J,this.context);break;case 1:I=this.fn.call(N,J[0]||null,this.context);break;default:I=this.wrappedFn.apply(N,J||[]);}};if(G.config.throwFail){K.call(this);}else{try{K.call(this);}catch(L){G.error(this+" failed: "+L.message,L);}}return I;},contains:function(I,H){if(H){return((this.fn==I)&&this.context==H);}else{return(this.fn==I);}},toString:function(){return"Subscriber "+this.id;}};(function(){var H=G.Lang,J=":",M=/[,|]\s*/,K="|",N="~AFTER~",O=G.cached(function(L,Q){if(!Q||!H.isString(L)){return L;}if(L.indexOf(J)==-1){return Q+J+L;}return L;}),I=G.cached(function(R,V){var Q=R,U,S,W,L,T;if(!H.isString(Q)){return Q;}L=Q.indexOf(N);if(L>-1){W=true;Q=Q.substr(N.length);}U=Q.split(M);if(U.length>1){S=U[0];Q=U[1];if(Q=="*"){Q=null;}}T=O(Q,V);return[S,T,W,Q];}),P=function(L){var Q=(H.isObject(L))?L:{};this._yuievt={id:G.guid(),events:{},targets:{},config:Q,chain:("chain" in Q)?Q.chain:G.config.chain,defaults:{context:Q.context||this,host:this,emitFacade:Q.emitFacade,fireOnce:Q.fireOnce,queuable:Q.queuable,broadcast:Q.broadcast,bubbles:("bubbles" in Q)?Q.bubbles:true}};};P.prototype={on:function(d,e,Q){var T=I(d,this._yuievt.config.prefix),W,b,Z,Y,R,a,V,g=G.Env.evt.handles,L,U,h,X=G.Node,S;if(H.isObject(d,true)){W=e;b=Q;Z=G.Array(arguments,0,true);Y={};L=d._after;delete d._after;G.each(d,function(f,c){if(f){W=f.fn||((G.Lang.isFunction(f))?f:W);b=f.context||b;}Z[0]=(L)?N+c:c;Z[1]=W;Z[2]=b;Y[c]=this.on.apply(this,Z);},this);return(this._yuievt.chain)?this:Y;}else{if(H.isFunction(d)){return G.Do.before.apply(G.Do,arguments);}}a=T[0];L=T[2];h=T[3];if(X&&(this instanceof X)&&(h in X.DOM_EVENTS)){Z=G.Array(arguments,0,true);Z.splice(2,0,X.getDOMNode(this));return G.on.apply(G,Z);}d=T[1];if(this instanceof YUI){U=G.Env.evt.plugins[d];Z=G.Array(arguments,0,true);Z[0]=h;if(U&&U.on){S=Z[2];if(X&&S&&(S instanceof X)){Z[2]=X.getDOMNode(S);}V=U.on.apply(G,Z);}else{if((!d)||(!U&&X&&(h in X.DOM_EVENTS))){V=G.Event._attach(Z);}}}if(!V){R=this._yuievt.events[d]||this.publish(d);Z=G.Array(arguments,1,true);W=(L)?R.after:R.on;V=W.apply(R,Z);}if(a){g[a]=g[a]||{};g[a][d]=g[a][d]||[];g[a][d].push(V);}return(this._yuievt.chain)?this:V;},subscribe:function(){return this.on.apply(this,arguments);},detach:function(Z,b,L){var S=I(Z,this._yuievt.config.prefix),Y=H.isArray(S)?S[0]:null,e=(S)?S[3]:null,U,V,c=G.Env.evt.handles,a,X,d=this._yuievt.events,R,T,W=true,Q=function(h,g){var f=h[g];if(f){while(f.length){U=f.pop();U.detach();}}};if(Y){a=c[Y];Z=S[1];if(a){if(Z){Q(a,Z);}else{for(T in a){if(a.hasOwnProperty(T)){Q(a,T);}}}return(this._yuievt.chain)?this:true;}}else{if(H.isObject(Z)&&Z.detach){W=Z.detach();return(this._yuievt.chain)?this:true;}else{if(G.Node&&(this instanceof G.Node)&&((!e)||(e in G.Node.DOM_EVENTS))){X=G.Array(arguments,0,true);X[2]=G.Node.getDOMNode(this);return G.detach.apply(G,X);}}}V=G.Env.evt.plugins[e];if(this instanceof YUI){X=G.Array(arguments,0,true);if(V&&V.detach){return V.detach.apply(G,X);}else{if(!Z||(!V&&Z.indexOf(":")==-1)){X[0]=Z;return G.Event.detach.apply(G.Event,X);}}}if(Z){R=d[Z];if(R){return R.detach(b,L);}}else{for(T in d){if(d.hasOwnProperty(T)){W=W&&d[T].detach(b,L);}}return W;}return(this._yuievt.chain)?this:false;},unsubscribe:function(){return this.detach.apply(this,arguments);},detachAll:function(L){L=O(L,this._yuievt.config.prefix);return this.detach(L);},unsubscribeAll:function(){return this.detachAll.apply(this,arguments);},publish:function(R,S){R=O(R,this._yuievt.config.prefix);var Q,T,L,U=S||{};if(H.isObject(R)){L={};G.each(R,function(W,V){L[V]=this.publish(V,W||S);},this);return L;}Q=this._yuievt.events;T=Q[R];if(T){if(S){T.applyConfig(S,true);}}else{G.mix(U,this._yuievt.defaults);T=new G.CustomEvent(R,U);Q[R]=T;}if(U instanceof G.CustomEvent){Q[R].broadcast=false;}return Q[R];},addTarget:function(L){this._yuievt.targets[G.stamp(L)]=L;this._yuievt.hasTargets=true;},removeTarget:function(L){delete this._yuievt.targets[G.stamp(L)];},fire:function(S){var U=H.isString(S),R=(U)?S:(S&&S.type),T,L,Q;R=O(R,this._yuievt.config.prefix);T=this.getEvent(R);if(!T){if(this._yuievt.hasTargets){T=this.publish(R);T.details=G.Array(arguments,(U)?1:0,true);return this.bubble(T);}Q=true;}else{L=G.Array(arguments,(U)?1:0,true);Q=T.fire.apply(T,L);T.target=null;}return(this._yuievt.chain)?this:Q;},getEvent:function(L){L=O(L,this._yuievt.config.prefix);var Q=this._yuievt.events;return(Q&&L in Q)?Q[L]:null;},bubble:function(Q){var V=this._yuievt.targets,R=true,T,U,W,L,S;
if(!Q.stopped&&V){for(S in V){if(V.hasOwnProperty(S)){T=V[S];U=Q.type;W=T.getEvent(U);L=Q.target||this;if(!W){W=T.publish(U,Q);W.context=(Q.host===Q.context)?T:Q.context;W.host=T;W.defaultFn=null;W.preventedFn=null;W.stoppedFn=null;}W.target=L;W.currentTarget=T;R=R&&W.fire.apply(W,Q.details);if(W.stopped){break;}}}}return R;},after:function(R,Q){var L=G.Array(arguments,0,true);switch(H.type(R)){case"function":return G.Do.after.apply(G.Do,arguments);case"object":L[0]._after=true;break;default:L[0]=N+R;}return this.on.apply(this,L);},before:function(){return this.on.apply(this,arguments);}};G.EventTarget=P;G.mix(G,P.prototype,false,false,{bubbles:false});P.call(G);YUI.Env.globalEvents=YUI.Env.globalEvents||new P();G.Global=YUI.Env.globalEvents;})();},"@VERSION@",{requires:["oop"]});