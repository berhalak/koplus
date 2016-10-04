# koplus
# Create observables on the fly with [Knockout](http://knockoutjs.com/)

*Knockout* only allows you to bind to existing observables. With this library you can create observables on the fly, right from your binding expression.

Let's start with some examples. Here we have basic knockout binding for text:

```html
<span data-bind="text: CompanyName"><span>
<script>
    var viewModel = {
        CompanyName : ko.observable('github')
    }
    ko.applyBindings(viewModel);
</script>
```

Here's an equivalent example using koplus library, but with no explicit observable creation

```html
<span data-bind="text: +CompanyName"><span>
<script>
    koplus.init();
    var vm = {};
    ko.applyBindings(vm);
    console.log(ko.isObservable(vm.CompanyName)); // prints true
</script>
```

