jQuery.sap.declare("ypglmasterdetailportal.util.Formatter");
ypglmasterdetailportal.util.Formatter = {};
ypglmasterdetailportal.util.Formatter.component = null;
ypglmasterdetailportal.util.Formatter.i19n = function() {
            var args = [].slice.call(arguments);
            if (args.length > 1) {
                var key = args.shift();
                // Get the component and execute the i19n function
                return this.getOwnerComponent().i19n(key, args);
            }else{
            	return	ypglmasterdetailportal.util.Formatter.component.i19n(args[0]);
            }
            //return "";
        };

 