Link.prototype.bindEventLinkContext = function bindcontext(context) {
  var unshift = Array.prototype.unshift,
    quoteRegx = /[\'\"]/g,
    context = context,
    linker = this;

  var func = function (ev) {
    var el = context.el,
      fn = context.fn,
      args = context.args; // when fn is null, args is expr to eval.

    if (fn === null) {
      // expr 
      $eval(args, linker.model);
    } else if (linker.model[fn]) {
      if (!isArray(args)) {
        linker.model[fn].apply(linker.model, [ev, el]);
      }
      else {
        var eargs = [ev, el];
        var evaledArgs = [];
        each(args, function (arg) {
          arg = trim(arg);
          if (arg.charAt(0) === "'" || arg.charAt(0) === '"') {
            evaledArgs.push(arg.replace(quoteRegx, ''));
          } else {
            evaledArgs.push($eval(arg, linker.model));
          }
        });
        unshift.apply(eargs, evaledArgs);
        linker.model[fn].apply(linker.model, eargs);
      }

    }
  };

  addEventListenerHanlder(context.el, context.event, func);
  context.func = func; // update func ref
};



