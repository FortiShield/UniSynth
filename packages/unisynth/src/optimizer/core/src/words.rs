use lazy_static::lazy_static;
use swc_atoms::JsWord;

pub const QRL_SUFFIX: char = '$';
pub const LONG_SUFFIX: &str = "Qrl";

lazy_static! {
	pub static ref REF: JsWord = JsWord::from("ref");
	pub static ref QSLOT: JsWord = JsWord::from("q:slot");
	pub static ref CHILDREN: JsWord = JsWord::from("children");
	pub static ref HANDLE_WATCH: JsWord = JsWord::from("_hW");
	pub static ref _QRL: JsWord = JsWord::from("qrl");
	pub static ref _QRL_DEV: JsWord = JsWord::from("qrlDEV");
	pub static ref _INLINED_QRL: JsWord = JsWord::from("inlinedQrl");
	pub static ref _INLINED_QRL_DEV: JsWord = JsWord::from("inlinedQrlDEV");
	pub static ref _NOOP_QRL: JsWord = JsWord::from("_noopQrl");
	pub static ref _NOOP_QRL_DEV: JsWord = JsWord::from("_noopQrlDEV");
	pub static ref _REST_PROPS: JsWord = JsWord::from("_restProps");
	pub static ref QSEGMENT: JsWord = JsWord::from("$");
	pub static ref Q_SYNC: JsWord = JsWord::from("sync$");
	pub static ref UNISYNTH_INTERNAL: JsWord = JsWord::from("unisynth");
	pub static ref BUILDER_IO_UNISYNTH: JsWord = JsWord::from("@khulnasoft.com/unisynth");
	pub static ref BUILDER_IO_UNISYNTH_BUILD: JsWord =
		JsWord::from("@khulnasoft.com/unisynth/build");
	pub static ref BUILDER_IO_UNISYNTH_JSX: JsWord =
		JsWord::from("@khulnasoft.com/unisynth/jsx-runtime");
	pub static ref BUILDER_IO_UNISYNTH_JSX_DEV: JsWord =
		JsWord::from("@khulnasoft.com/unisynth/jsx-dev-runtime");
	pub static ref QCOMPONENT: JsWord = JsWord::from("component$");
	pub static ref USE_LEXICAL_SCOPE: JsWord = JsWord::from("useLexicalScope");
	pub static ref H: JsWord = JsWord::from("h");
	pub static ref FRAGMENT: JsWord = JsWord::from("Fragment");
	pub static ref _IMMUTABLE: JsWord = JsWord::from("_IMMUTABLE");
	pub static ref _INLINED_FN: JsWord = JsWord::from("_fnSignal");
	pub static ref IS_SERVER: JsWord = JsWord::from("isServer");
	pub static ref IS_BROWSER: JsWord = JsWord::from("isBrowser");
	pub static ref IS_DEV: JsWord = JsWord::from("isDev");
	pub static ref COMPONENT: JsWord = JsWord::from("component$");
	pub static ref _REG_SYMBOL: JsWord = JsWord::from("_regSymbol");
	pub static ref _JSX_BRANCH: JsWord = JsWord::from("_jsxBranch");
	pub static ref _QRL_SYNC: JsWord = JsWord::from("_qrlSync");
	pub static ref _WRAP_PROP: JsWord = JsWord::from("_wrapProp");
	pub static ref _WRAP_SIGNAL: JsWord = JsWord::from("_wrapSignal");
	pub static ref _JSX_Q: JsWord = JsWord::from("_jsxQ");
	pub static ref _JSX_S: JsWord = JsWord::from("_jsxS");
	pub static ref _JSX_C: JsWord = JsWord::from("_jsxC");
	pub static ref JSX: JsWord = JsWord::from("jsx");
	pub static ref JSXS: JsWord = JsWord::from("jsxs");
	pub static ref JSX_DEV: JsWord = JsWord::from("jsxDEV");
}
